'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SpaceTypeSelector, { SpaceType } from '@/components/space/SpaceTypeSelector'

export default function SpaceTypePage() {
  const router = useRouter()
  const [selectedTypes, setSelectedTypes] = useState<SpaceType[]>([])

  const handleNext = () => {
    if (selectedTypes.length > 0) {
      // 선택된 공간 유형을 localStorage에 저장
      localStorage.setItem('selectedSpaceTypes', JSON.stringify(selectedTypes))
      router.push('/host/space/register/details')
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-[#7047EB] text-white py-4 px-6 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">공간 유형 선택</h1>
        <div className="w-8" />
      </div>

      {/* 공간 유형 선택 */}
      <div className="p-6">
        <SpaceTypeSelector
          selectedTypes={selectedTypes}
          onChange={setSelectedTypes}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-4">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={selectedTypes.length === 0}
          className={`flex-1 py-3 px-4 rounded-lg font-medium ${
            selectedTypes.length > 0
              ? 'bg-[#7047EB] text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </main>
  )
}
