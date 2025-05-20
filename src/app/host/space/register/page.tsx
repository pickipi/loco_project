'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SpaceTypeSelector, { SpaceType } from '@/components/space/SpaceTypeSelector'
import styles from './page.module.css'

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
    <main className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className={styles.headerTitle}>공간 유형 선택</h1>
        <div className={styles.spacer} />
      </div>

      {/* 공간 유형 선택 */}
      <div className={styles.content}>
        <SpaceTypeSelector
          selectedTypes={selectedTypes}
          onChange={setSelectedTypes}
        />
      </div>

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        <button
          onClick={() => router.back()}
          className={styles.buttonSecondary}
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={selectedTypes.length === 0}
          className={selectedTypes.length > 0 ? styles.buttonPrimary : styles.buttonDisabled}
        >
          다음
        </button>
      </div>
    </main>
  )
}
