"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { SpaceType } from "@/components/space/SpaceTypeSelector";
import AddressSearch from "@/components/AddressSearch";
import styles from "../../register/details/page.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

// 카카오맵 동적 import
const KakaoMap = dynamic(() => import("@/components/map/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapContainer}>지도를 불러오는 중...</div>
  ),
});

interface SpaceForm {
  spaceType: SpaceType;
  spaceName: string;
  description: string;
  imageId: number | null;
  uploadDate: Date;
  maxCapacity: number;
  address: string;
  address2: string;
  address3: string;
  latitude: number;
  longitude: number;
  price: number;
  isActive: boolean;
  spaceRating: number;
  hostId?: number; // 임시 호스트 ID 필드 (테스트용)
}

export default function SpaceEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState<SpaceForm | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isAddressVerified, setIsAddressVerified] = useState(true);
  const [loading, setLoading] = useState(true);

  // 공간 정보 불러오기
  useEffect(() => {
    async function fetchSpace() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/spaces/${id}`);
        const data = await res.json();
        const space = data.data || data; // RsData 래핑 여부 대응
        setForm({
          spaceType: space.spaceType,
          spaceName: space.spaceName,
          description: space.description,
          imageId: space.imageId,
          uploadDate: space.uploadDate
            ? new Date(space.uploadDate)
            : new Date(),
          maxCapacity: space.maxCapacity,
          address: space.address,
          address2: space.address2 || "",
          address3: space.address3 || "",
          latitude: space.latitude,
          longitude: space.longitude,
          price: space.price,
          isActive: space.isActive,
          spaceRating: space.spaceRating || 0,
          hostId: space.hostId || "", // 임시 호스트 ID 세팅
        });
        setMapCenter({ lat: space.latitude, lng: space.longitude });
        setLoading(false);
      } catch (e) {
        alert("공간 정보를 불러오지 못했습니다.");
        router.back();
      }
    }
    if (id) fetchSpace();
  }, [id, router]);

  if (loading || !form)
    return <div className={styles.container}>불러오는 중...</div>;

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

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/spaces/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("수정 실패");
      alert("수정이 완료되었습니다!");
      router.push("/host/spaces");
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>공간 정보 수정</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 공간 유형 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>공간 유형</h3>
          </div>
          <div className={styles.tagContainer}>
            <div className={styles.tag}>{getSpaceTypeName(form.spaceType)}</div>
          </div>
        </div>
        {/* 공간명 */}
        <div className={styles.section}>
          <label className={styles.label}>
            공간명 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={form.spaceName}
            onChange={(e) =>
              setForm((f) => f && { ...f, spaceName: e.target.value })
            }
            className={styles.input}
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
              setForm(
                (f) =>
                  f && {
                    ...f,
                    hostId:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  }
              )
            }
            className={styles.input}
            placeholder="호스트 ID를 입력하세요"
          />
        </div>
        {/* 공간 소개 */}
        <div className={styles.section}>
          <label className={styles.label}>
            공간 소개 <span className={styles.required}>*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => f && { ...f, description: e.target.value })
            }
            className={styles.textarea}
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
                setForm(
                  (f) =>
                    f && {
                      ...f,
                      maxCapacity: Math.max(
                        1,
                        Math.min(1000, parseInt(e.target.value) || 1)
                      ),
                    }
                )
              }
              className={styles.numberInput}
              min="1"
              max="1000"
              required
            />
            <span className={styles.unit}>명</span>
          </div>
        </div>
        {/* 가격 */}
        <div className={styles.section}>
          <label className={styles.label}>
            가격 <span className={styles.required}>*</span>
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={form.price === 0 ? "" : form.price}
              onChange={(e) => {
                const value = e.target.value;
                setForm(
                  (f) =>
                    f && { ...f, price: value === "" ? 0 : parseInt(value) }
                );
              }}
              className={styles.numberInput}
              min="0"
              required
              placeholder="10000"
            />
            <span className={styles.unit}>원/시간</span>
          </div>
        </div>
        {/* 주소 */}
        <div className={styles.section}>
          <label className={styles.label}>
            주소 <span className={styles.required}>*</span>
          </label>
          <div className="space-y-4">
            <div className={styles.addressContainer}>
              <input
                type="text"
                value={form.address}
                className={styles.addressInput}
                placeholder="주소를 검색해주세요"
                readOnly
                required
              />
              <AddressSearch
                onComplete={(data) => {
                  setForm(
                    (f) =>
                      f && {
                        ...f,
                        address: data.address,
                        latitude: data.latitude || f.latitude,
                        longitude: data.longitude || f.longitude,
                      }
                  );
                  setIsAddressVerified(true);
                }}
                buttonClassName={styles.searchButton}
              />
            </div>
            <div>
              <input
                type="text"
                value={form.address2}
                onChange={(e) =>
                  setForm((f) => f && { ...f, address2: e.target.value })
                }
                className={styles.input}
                placeholder="상세 주소를 입력해주세요 (선택)"
              />
            </div>
            <div>
              <input
                type="text"
                value={form.address3}
                onChange={(e) =>
                  setForm((f) => f && { ...f, address3: e.target.value })
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
                  setForm((f) => f && { ...f, latitude: lat, longitude: lng });
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
                form.price <= 0
                  ? styles.buttonDisabled
                  : styles.buttonPrimary
              }
              disabled={
                !form.spaceName ||
                !form.description ||
                form.description.length < 20 ||
                !form.address ||
                !isAddressVerified ||
                form.price <= 0
              }
            >
              저장
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
