'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/space/ImageUploader'
import TagInput from '@/components/space/TagInput'
import type { SpaceType } from '@/components/space/SpaceTypeSelector'

// 카카오맵 컴포넌트를 동적으로 import (SSR 비활성화)
const KakaoMap = dynamic(() => import('@/components/map/KakaoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
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
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">공간 정보를 입력해주세요</h1>
          <p className="text-sm text-red-500 mt-1">* 필수입력</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* 선택된 공간 유형 표시 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">선택된 공간 유형</h3>
            <button
              type="button"
              onClick={() => router.push('/host/space/register')}
              className="text-sm text-[#7047EB] hover:text-[#5835B0] flex items-center"
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
          <div className="flex flex-wrap gap-2">
            {form.spaceTypes.map((type) => (
              <div
                key={type}
                className="px-3 py-1 bg-[#7047EB]/5 text-[#7047EB] rounded-full text-sm border border-[#7047EB]"
              >
                {getSpaceTypeName(type)}
              </div>
            ))}
          </div>
        </div>

        {/* 공간명 입력 필드 (필수) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공간명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.spaceName}
            onChange={(e) => setForm(prev => ({ ...prev, spaceName: e.target.value }))}
            className="w-full p-2 border rounded-md"
            placeholder="(예시) 인디레코즈 하이브 회의실"
            maxLength={18}
            required
          />
        </div>

        {/* 공간 상세 소개 입력 필드 (필수) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공간 소개 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.detailedDescription}
            onChange={(e) => setForm(prev => ({ ...prev, detailedDescription: e.target.value }))}
            className="w-full p-2 border rounded-md min-h-[150px]"
            placeholder="게스트들에게 필요한 공간 정보를 상세하게 소개해주세요."
            minLength={20}
            maxLength={500}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            ({form.detailedDescription.length}/500자) 최소 20자 이상 입력해주세요.
          </p>
        </div>

        {/* 최대 수용 인원 입력 필드 (필수) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최대 수용 인원 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={form.maxCapacity}
              onChange={(e) => setForm(prev => ({ 
                ...prev, 
                maxCapacity: Math.max(1, Math.min(1000, parseInt(e.target.value) || 1))
              }))}
              className="w-32 p-2 border rounded-md"
              min="1"
              max="1000"
              required
            />
            <span className="ml-2 text-gray-600">명</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            최소 1명부터 최대 1,000명까지 설정 가능합니다.
          </p>
        </div>

        {/* 공간 태그 입력 컴포넌트 (선택) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공간 태그
          </label>
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

        {/* 시설 안내 입력 컴포넌트 (선택) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시설 안내
          </label>
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

        {/* 예약 시 주의사항 입력 컴포넌트 (선택) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            예약 시 주의사항
          </label>
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

        {/* 이미지 업로드 컴포넌트 (선택) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공간 이미지
          </label>
          <p className="text-xs text-gray-500 mb-4">2048 * 1158 권장, 최대 3MB</p>
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

        {/* 주소 입력 섹션 (필수) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주소 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            {/* 기본 주소 입력 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                className="flex-1 p-2 border rounded-md"
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
                className="px-4 py-2 bg-[#7047EB] text-white rounded-md"
              >
                주소 검색
              </button>
            </div>
            {/* 상세 주소 입력 */}
            <div>
              <input
                type="text"
                value={form.detailedAddress}
                onChange={(e) => setForm(prev => ({ ...prev, detailedAddress: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="상세 주소를 입력해주세요"
              />
            </div>
            {/* 위치 정보 입력 */}
            <div>
              <input
                type="text"
                value={form.locationInfo}
                onChange={(e) => setForm(prev => ({ ...prev, locationInfo: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="위치 정보를 입력해주세요 (예: 강남역 3번 출구 도보 5분)"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                ({form.locationInfo.length}/20자)
              </p>
            </div>

            {/* 카카오맵 표시 */}
            <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
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

        {/* 하단 네비게이션 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-5xl mx-auto flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
              이전
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-[#7047EB] text-white font-medium disabled:bg-gray-300"
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