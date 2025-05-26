'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/space/ImageUploader'
import TagInput from '@/components/space/TagInput'
import type { SpaceType } from '@/components/space/SpaceTypeSelector'
import styles from './page.module.css'
//import api from '@/lib/axios'

// 카카오맵 컴포넌트를 동적으로 import (SSR 비활성화)
const KakaoMap = dynamic(() => import('@/components/map/KakaoMap'), {
  ssr: false,
  loading: () => (
    <div className={styles.mapContainer}>지도를 불러오는 중...</div>
  ),
});

//로컬 url
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

// 공간 등록 폼 데이터 타입 정의
interface SpaceForm {
  spaceType: SpaceType; // 공간 유형 (단일 선택)
  spaceName: string; // 공간 이름
  description: string; // 공간 설명
  maxCapacity: number; // 최대 수용 인원
  address: string; // 주소
  address2: string; // 상세 주소
  address3: string; // 위치 정보 (근처)
  latitude: number; // 위도
  longitude: number; // 경도
  price: number; // 가격
  isActive: boolean; // 공개 여부
  spaceRating: number; // 공간 평점
  hostId?: number; // 임시 호스트 ID (테스트용)
}

export default function SpaceDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 이미지 상태 관리
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  // 이미지 업로드 핸들러
  const handleMainImageUpload = (file: File) => {
    setMainImage(file);
  };

  const handleAdditionalImagesUpload = (files: File[]) => {
    setAdditionalImages((prev) => [...prev, ...files]);
  };

  const handleMainImageDelete = () => {
    setMainImage(null);
  };

  const handleAdditionalImageDelete = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 상태 관리 - 초기값 설정
  const [form, setForm] = useState<SpaceForm>({
    spaceType: 'MEETING',      // 기본 공간 유형
    spaceName: '',             // 공간 이름 (빈 문자열)
    description: '',           // 설명 (빈 문자열)
    maxCapacity: 1,            // 최소 수용 인원
    address: '',               // 주소 (빈 문자열)
    address2: '',              // 상세 주소 (빈 문자열)
    address3: '',              // 주변 정보 (빈 문자열)
    latitude: 37.5665,         // 기본 위도 (서울시청)
    longitude: 126.9780,       // 기본 경도 (서울시청)
    price: 0,                  // 가격 (0원)
    isActive: true,            // 공개 여부 (기본값 true)
    spaceRating: 0,            // 평점 (초기값 0)
    hostId: 0,                // 호스트 ID 초기값
  })

  // 주소 검색 완료 상태 추가
  const [isAddressVerified, setIsAddressVerified] = useState(false);

  // 지도 중심 좌표 상태 관리
  const [mapCenter, setMapCenter] = useState({
    lat: 37.5665, // 서울시청 기본 위도
    lng: 126.978, // 서울시청 기본 경도
  });

  // 주소 검색 상태 관리
  const [shouldSearch, setShouldSearch] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 이전에 선택한 공간 유형 불러오기
  useEffect(() => {
    const savedType = localStorage.getItem("selectedSpaceTypes");
    if (savedType) {
      try {
        const types = JSON.parse(savedType) as SpaceType[];
        setForm((prev) => ({ ...prev, spaceType: types[0] }));
      } catch (error) {
        console.error("공간 유형 데이터 파싱 오류:", error);
      }
    }
  }, []);

  // 공간 유형 이름 변환 함수
  const getSpaceTypeName = (type: SpaceType): string => {
    const typeNames: Record<SpaceType, string> = {
      MEETING: "모임 공간",
      PRACTICE: "연습 공간",
      PHOTO: "촬영 공간",
      ACTIVITY: "행사 공간",
      CAMPING: "캠핑 공간",
      OFFICE: "오피스 공간",
    };
    return typeNames[type];
  };

  // AWS S3 이미지 업로드 함수
  const uploadImagesToS3 = async () => {
    if (!mainImage) {
      throw new Error("대표 이미지를 등록해주세요.");
    }

    try {
      const formData = new FormData();
      formData.append("mainImage", mainImage);

      additionalImages.forEach((file, index) => {
        formData.append(`additionalImages`, file);
      });

      // S3 업로드 API 호출
      const response = await fetch(
        `${API_BASE_URL}/api/v1/spaces/images/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      const imageUrls = await response.json();
      return imageUrls;
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainImage) {
      alert("대표 이미지를 등록해주세요.");
      return;
    }

    try {
      // 이미지 먼저 업로드
      const imageUrls = await uploadImagesToS3();

      // 요청 데이터 준비
      const requestData = {
        spaceType: form.spaceType,
        spaceName: form.spaceName,
        description: form.description,
        maxCapacity: form.maxCapacity,
        address: form.address,
        address2: form.address2,
        address3: form.address3,
        latitude: form.latitude,
        longitude: form.longitude,
        price: form.price,
        isActive: form.isActive,
        spaceRating: form.spaceRating,
        hostId: form.hostId,
        mainImageUrl: imageUrls.mainImageUrl,
        additionalImageUrls: imageUrls.additionalImageUrls,
      };

      // API 엔드포인트 확인
      const apiUrl = `${API_BASE_URL}/api/v1/spaces/${form.hostId}/register`;
      console.log("API 요청 URL:", apiUrl);
      console.log("요청 데이터:", requestData);

      // API 호출
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      // 응답 확인
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API 오류 응답:", errorData);
        throw new Error(
          `공간 등록 실패: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("공간 등록 성공:", data);

      // 성공 시 완료 페이지로 이동
      router.push("/host/space/register/complete");
    } catch (error) {
      console.error("공간 등록 중 오류 발생:", error);
      alert(
        error instanceof Error
          ? error.message
          : "공간 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  return (
    <main className={styles.container}>
      {/* 페이지 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>공간 정보를 입력해주세요</h1>
          <p className={styles.requiredText}>* 필수입력</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 선택된 공간 유형 표시 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>선택된 공간 유형</h3>
            <button
              type="button"
              onClick={() => router.push("/host/space/register")}
              className={styles.editButton}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              수정
            </button>
          </div>
          <div className={styles.tagContainer}>
            {form.spaceType && (
              <div className={styles.tag}>
                {getSpaceTypeName(form.spaceType)}
              </div>
            )}
          </div>
        </div>

        {/* 공간명 입력 필드 */}
        <div className={styles.section}>
          <label className={styles.label}>
            공간명 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={form.spaceName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, spaceName: e.target.value }))
            }
            className={styles.input}
            placeholder="(예시) 인디레코즈 하이브 회의실"
            maxLength={18}
            required
          />
        </div>

        {/* 호스트 ID (테스트용) */}
        <div className={styles.section}>
          <label className={styles.label}>호스트 ID (테스트용)</label>
          <input
            type="number"
            value={form.hostId ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hostId:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            className={styles.input}
            placeholder="호스트 ID를 입력하세요"
          />
        </div>

        {/* 공간 상세 소개 */}
        <div className={styles.section}>
          <label className={styles.label}>
            공간 소개 <span className={styles.required}>*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className={styles.textarea}
            placeholder="게스트들에게 필요한 공간 정보를 상세하게 소개해주세요."
            minLength={20}
            maxLength={500}
            required
          />
          <p className={styles.charCount}>
            ({form.description.length}/500자) 최소 20자 이상 입력해주세요.
          </p>
        </div>

        {/* 최대 수용 인원 */}
        <div className={styles.section}>
          <label className={styles.label}>
            최대 수용 인원 <span className={styles.required}>*</span>
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={form.maxCapacity}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  maxCapacity: Math.max(
                    1,
                    Math.min(1000, parseInt(e.target.value) || 1)
                  ),
                }))
              }
              className={styles.numberInput}
              min="1"
              max="1000"
              required
            />
            <span className={styles.unit}>명</span>
          </div>
          <p className={styles.helpText}>
            최소 1명부터 최대 1,000명까지 설정 가능합니다.
          </p>
        </div>

        {/* 가격 입력 */}
        <div className={styles.section}>
          <label className={styles.label}>
            가격 <span className={styles.required}>*</span>
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  price: Math.max(0, parseInt(e.target.value) || 0),
                }))
              }
              className={styles.numberInput}
              min="0"
              required
              placeholder="10000"
            />
            <span className={styles.unit}>원/시간</span>
          </div>
        </div>

        {/* 공간 이미지 업로드 */}
        <div className={styles.section}>
          <label className={styles.label}>
            공간 이미지 <span className={styles.required}>*</span>
          </label>
          <p className={styles.helpText}>
            대표 이미지 1장과 추가 이미지를 등록해주세요. (최대 10장)
          </p>
          <ImageUploader
            mainImage={mainImage}
            additionalImages={additionalImages}
            onMainImageUpload={setMainImage}
            onAdditionalImagesUpload={setAdditionalImages}
            onMainImageDelete={() => setMainImage(null)}
            onAdditionalImageDelete={(index: number) => {
              setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        </div>

        {/* 주소 입력 */}
        <div className={styles.section}>
          <label className={styles.label}>
            주소 <span className={styles.required}>*</span>
          </label>
          <div className="space-y-4">
            <div className={styles.addressContainer}>
              <input
                type="text"
                value={form.address}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, address: e.target.value }));
                  setIsAddressVerified(false);
                }}
                className={styles.addressInput}
                placeholder="주소를 입력해주세요"
                required
              />
              <button
                type="button"
                onClick={() => {
                  if (form.address) {
                    setShouldSearch(true);
                    setIsAddressVerified(true);
                  }
                }}
                className={styles.searchButton}
                disabled={!form.address}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                주소 검색
              </button>
            </div>
            <input
              type="text"
              value={form.address2}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address2: e.target.value }))
              }
              className={styles.input}
              placeholder="상세 주소를 입력해주세요 (선택)"
            />
            <div>
              <input
                type="text"
                value={form.address3}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address3: e.target.value }))
                }
                className={styles.input}
                placeholder="주변 정보를 입력해주세요 (예: 강남역 3번 출구 도보 5분) (선택)"
                maxLength={20}
              />
            </div>

            <div className={styles.mapContainer}>
              <KakaoMap
                address={form.address}
                center={mapCenter}
                shouldSearch={shouldSearch}
                onLocationChange={(lat: number, lng: number) => {
                  setForm((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                  }));
                  setMapCenter({ lat, lng });
                  setShouldSearch(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.buttonSecondary}
            >
              이전
            </button>
            <button
              type="submit"
              className={
                !form.spaceName ||
                !form.description ||
                form.description.length < 20 ||
                !form.address ||
                !isAddressVerified ||
                form.price <= 0 ||
                !mainImage
                  ? styles.buttonDisabled
                  : styles.buttonPrimary
              }
              disabled={
                !form.spaceName ||
                !form.description ||
                form.description.length < 20 ||
                !form.address ||
                !isAddressVerified ||
                form.price <= 0 ||
                !mainImage
              }
            >
              다음
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
