'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/space/ImageUploader'
import TagInput from '@/components/space/TagInput'
import type { SpaceType } from '@/components/space/SpaceTypeSelector'
import styles from './page.module.css'

// 카카오맵 컴포넌트를 동적으로 import (SSR 비활성화)
const KakaoMap = dynamic(() => import('@/components/map/KakaoMap'), {
  ssr: false,
  loading: () => (
    <div className={styles.mapContainer}>
      지도를 불러오는 중...
    </div>
  ),
})

// 공간 등록 폼 데이터 타입 정의
interface SpaceForm {
  spaceName: string;          // 공간 이름
  description: string;        // 간단 설명
  detailedDescription: string; // 상세 설명
  spaceTypes: SpaceType[];    // 공간 유형 (다중 선택 가능)
  customTags: string[];       // 커스텀 태그
  facilities: string[];       // 시설 정보
  precautions: string[];      // 주의사항
  price: number;             // 가격
  address: string;           // 주소
  detailedAddress: string;   // 상세 주소
  locationInfo: string;      // 위치 정보 (예: 역에서 도보 5분)
  maxCapacity: number;       // 최대 수용 인원
  isActive: boolean;         // 공개 여부
  mainImage: File | null;    // 대표 이미지
  additionalImages: File[];  // 추가 이미지들
  latitude: number;          // 위도
  longitude: number;         // 경도
}

export default function SpaceDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 폼 상태 관리
  const [form, setForm] = useState<SpaceForm>({
    spaceName: '',
    description: '',
    detailedDescription: '',
    spaceTypes: [],
    customTags: [],
    facilities: [],
    precautions: [],
    price: 0,
    address: '',
    detailedAddress: '',
    locationInfo: '',
    maxCapacity: 1,
    isActive: true,
    mainImage: null,
    additionalImages: [],
    latitude: 37.5665,  // 서울 시청 기본 좌표
    longitude: 126.9780,
  })

  // 지도 중심 좌표 상태 관리
  const [mapCenter, setMapCenter] = useState({
    lat: 37.5665,
    lng: 126.9780,
  })

  // 컴포넌트 마운트 시 localStorage에서 이전에 선택한 공간 유형 불러오기
  useEffect(() => {
    const savedType = localStorage.getItem('selectedSpaceTypes')
    if (savedType) {
      try {
        const types = JSON.parse(savedType) as SpaceType[]
        setForm(prev => ({ ...prev, spaceTypes: types }))
      } catch (error) {
        console.error('공간 유형 데이터 파싱 오류:', error)
      }
    }
    if (typeof window !== 'undefined') {
      // window.kakao 호출, localStorage 등은 여기에
    }
  }, [])

  // 공간 유형 이름 변환 함수
  const getSpaceTypeName = (type: SpaceType): string => {
    const typeNames: Record<SpaceType, string> = {
      'MEETING': '모임 공간',
      'PRACTICE': '연습 공간',
      'PHOTO': '촬영 공간',
      'ACTIVITY': '행사 공간',
      'CAMPING': '캠핑 공간',
      'OFFICE': '오피스 공간'
    }
    return typeNames[type]
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // API 호출하여 공간 정보 저장
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          uploadDate: new Date(),
          spaceTypes: form.spaceTypes,
          isActive: true,
          spaceRating: 0
        }),
      })

      if (response.ok) {
        router.push('/host/spaces')  // 성공 시 공간 목록 페이지로 이동
      }
    } catch (error) {
      console.error('공간 등록 중 오류 발생:', error)
    }
  }

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
              onClick={() => router.push('/host/space/register')}
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
            {form.spaceTypes.map((type) => (
              <div key={type} className={styles.tag}>
                {getSpaceTypeName(type)}
              </div>
            ))}
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
            onChange={(e) => setForm(prev => ({ ...prev, spaceName: e.target.value }))}
            className={styles.input}
            placeholder="(예시) 인디레코즈 하이브 회의실"
            maxLength={18}
            required
          />
        </div>

        {/* 공간 상세 소개 */}
        <div className={styles.section}>
          <label className={styles.label}>
            공간 소개 <span className={styles.required}>*</span>
          </label>
          <textarea
            value={form.detailedDescription}
            onChange={(e) => setForm(prev => ({ ...prev, detailedDescription: e.target.value }))}
            className={styles.textarea}
            placeholder="게스트들에게 필요한 공간 정보를 상세하게 소개해주세요."
            minLength={20}
            maxLength={500}
            required
          />
          <p className={styles.charCount}>
            ({form.detailedDescription.length}/500자) 최소 20자 이상 입력해주세요.
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
              onChange={(e) => setForm(prev => ({ 
                ...prev, 
                maxCapacity: Math.max(1, Math.min(1000, parseInt(e.target.value) || 1))
              }))}
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

        {/* 공간 태그 */}
        <div className={styles.section}>
          <label className={styles.label}>공간 태그</label>
          <TagInput
            tags={form.customTags}
            maxTags={5}
            placeholder="태그를 입력해주세요"
            onAddTag={(tag) => setForm(prev => ({
              ...prev,
              customTags: [...prev.customTags, tag]
            }))}
            onRemoveTag={(index) => setForm(prev => ({
              ...prev,
              customTags: prev.customTags.filter((_, i) => i !== index)
            }))}
          />
        </div>

        {/* 시설 안내 */}
        <div className={styles.section}>
          <label className={styles.label}>시설 안내</label>
          <TagInput
            tags={form.facilities}
            maxTags={10}
            placeholder="이용 가능한 시설을 입력해주세요"
            onAddTag={(facility) => setForm(prev => ({
              ...prev,
              facilities: [...prev.facilities, facility]
            }))}
            onRemoveTag={(index) => setForm(prev => ({
              ...prev,
              facilities: prev.facilities.filter((_, i) => i !== index)
            }))}
          />
        </div>

        {/* 예약 시 주의사항 */}
        <div className={styles.section}>
          <label className={styles.label}>예약 시 주의사항</label>
          <TagInput
            tags={form.precautions}
            maxTags={10}
            placeholder="예약 시 주의사항을 입력해주세요"
            onAddTag={(precaution) => setForm(prev => ({
              ...prev,
              precautions: [...prev.precautions, precaution]
            }))}
            onRemoveTag={(index) => setForm(prev => ({
              ...prev,
              precautions: prev.precautions.filter((_, i) => i !== index)
            }))}
          />
        </div>

        {/* 이미지 업로드 */}
        <div className={styles.section}>
          <label className={styles.label}>공간 이미지</label>
          <p className={styles.helpText}>2048 * 1158 권장, 최대 3MB</p>
          <ImageUploader
            mainImage={form.mainImage}
            additionalImages={form.additionalImages}
            onMainImageUpload={(file) => setForm(prev => ({ ...prev, mainImage: file }))}
            onAdditionalImagesUpload={(files) => setForm(prev => ({
              ...prev,
              additionalImages: [...prev.additionalImages, ...files]
            }))}
            onMainImageDelete={() => setForm(prev => ({ ...prev, mainImage: null }))}
            onAdditionalImageDelete={(index) => setForm(prev => ({
              ...prev,
              additionalImages: prev.additionalImages.filter((_, i) => i !== index)
            }))}
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
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                className={styles.input}
                placeholder="주소를 입력해주세요"
                required
              />
              <button
                type="button"
                onClick={() => {
                  if (form.address) {
                    setMapCenter(prev => ({ ...prev }))
                  }
                }}
                className={styles.searchButton}
              >
                주소 검색
              </button>
            </div>
            <input
              type="text"
              value={form.detailedAddress}
              onChange={(e) => setForm(prev => ({ ...prev, detailedAddress: e.target.value }))}
              className={styles.input}
              placeholder="상세 주소를 입력해주세요"
            />
            <div>
              <input
                type="text"
                value={form.locationInfo}
                onChange={(e) => setForm(prev => ({ ...prev, locationInfo: e.target.value }))}
                className={styles.input}
                placeholder="위치 정보를 입력해주세요 (예: 강남역 3번 출구 도보 5분)"
                maxLength={20}
              />
              <p className={styles.charCount}>
                ({form.locationInfo.length}/20자)
              </p>
            </div>

            <div className={styles.mapContainer}>
              <KakaoMap
                address={form.address}
                center={mapCenter}
                onLocationChange={(lat: number, lng: number) => {
                  setForm(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                  }))
                  setMapCenter({ lat, lng })
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
                !form.detailedDescription ||
                form.detailedDescription.length < 20 ||
                !form.address ||
                form.spaceTypes.length === 0
                  ? styles.buttonDisabled
                  : styles.buttonPrimary
              }
              disabled={
                !form.spaceName ||
                !form.detailedDescription ||
                form.detailedDescription.length < 20 ||
                !form.address ||
                form.spaceTypes.length === 0
              }
            >
              다음
            </button>
          </div>
        </div>
      </form>
    </main>
  )
} 