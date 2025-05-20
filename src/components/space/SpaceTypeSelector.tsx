'use client'

import React from 'react'
import Image from 'next/image'

// 공간 유형을 정의하는 타입
export type SpaceType = 'MEETING' | 'PRACTICE' | 'PHOTO' | 'ACTIVITY' | 'CAMPING' | 'OFFICE'

// 각 공간 유형에 대한 정보를 담는 인터페이스
interface SpaceTypeOption {
  value: SpaceType      // 공간 유형 값
  label: string         // 표시될 레이블
  description: string   // 공간 설명
  icon: string          // SVG 아이콘 경로 (현재 미사용)
  iconEmoji: string     // 표시될 이모지
}

// 사용 가능한 공간 유형 목록 정의
const SPACE_TYPE_OPTIONS: SpaceTypeOption[] = [
  {
    value: 'MEETING',
    label: '모임 공간',
    description: '스터디, 모임, 워크샵 등을 위한 공간',
    icon: '/icons/meeting-space.svg',
    iconEmoji: '👥'
  },
  {
    value: 'PRACTICE',
    label: '연습 공간',
    description: '댄스, 무용, 연기 연습을 위한 공간',
    icon: '/icons/practice-space.svg',
    iconEmoji: '🎵'
  },
  {
    value: 'PHOTO',
    label: '촬영 공간',
    description: '사진, 영상 촬영을 위한 공간',
    icon: '/icons/photo-space.svg',
    iconEmoji: '📸'
  },
  {
    value: 'ACTIVITY',
    label: '행사 공간',
    description: '행사, 이벤트를 위한 공간',
    icon: '/icons/event-space.svg',
    iconEmoji: '✨'
  },
  {
    value: 'CAMPING',
    label: '캠핑 공간',
    description: '캠핑, 바베큐를 위한 공간',
    icon: '/icons/camping-space.svg',
    iconEmoji: '⛺'
  },
  {
    value: 'OFFICE',
    label: '오피스 공간',
    description: '개인, 그룹 작업을 위한 공간',
    icon: '/icons/office-space.svg',
    iconEmoji: '💼'
  }
]

// 컴포넌트 Props 인터페이스
interface SpaceTypeSelectorProps {
  selectedTypes: SpaceType[]                    // 선택된 공간 유형 배열
  onChange: (types: SpaceType[]) => void        // 선택 변경 시 호출될 콜백 함수
}

export default function SpaceTypeSelector({
  selectedTypes,
  onChange
}: SpaceTypeSelectorProps) {
  // 공간 유형 선택/해제 처리 함수
  const handleTypeClick = (type: SpaceType) => {
    if (selectedTypes.includes(type)) {
      // 이미 선택된 유형이면 제거
      onChange(selectedTypes.filter(t => t !== type))
    } else {
      // 선택되지 않은 유형이면 추가
      onChange([...selectedTypes, type])
    }
  }

  return (
    <div className="space-y-4">
      {/* 안내 메시지 섹션 */}
      <div className="bg-gray-50 px-6 py-4 rounded-lg">
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 여러 공간 용도를 선택할 수 있습니다.</li>
          <li>• 검수 단계에서 검수 기준에 적합하지 않은 유형은 제외될 수 있습니다.</li>
          <li>• 검수 신청 후, 공간 유형 변경은 고객센터를 통해서만 가능하오니, 신중히 선택해주세요!</li>
        </ul>
      </div>

      {/* 공간 유형 선택 버튼 목록 */}
      <div className="grid grid-cols-1 gap-4">
        {SPACE_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleTypeClick(option.value)}
            className={`flex items-center p-4 rounded-lg border ${
              selectedTypes.includes(option.value)
                ? 'border-[#7047EB] bg-[#7047EB]/5'  // 선택된 상태 스타일
                : 'border-gray-200 hover:border-gray-300'  // 기본 상태 스타일
            }`}
          >
            {/* 이모지 아이콘 */}
            <div className="w-12 h-12 flex items-center justify-center mr-4 text-3xl">
              {option.iconEmoji}
            </div>
            {/* 공간 정보 */}
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900">{option.label}</h3>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            {/* 선택 상태 표시 체크박스 */}
            <div className={`w-6 h-6 rounded-full border-2 ml-4 flex items-center justify-center ${
              selectedTypes.includes(option.value)
                ? 'border-[#7047EB] bg-[#7047EB]'  // 선택된 상태
                : 'border-gray-300'  // 기본 상태
            }`}>
              {selectedTypes.includes(option.value) && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 