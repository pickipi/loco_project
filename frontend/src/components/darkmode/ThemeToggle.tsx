'use client'

import { useTheme } from './ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleButton}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {theme === 'dark' ? (
        <FiSun size={20} className={styles.sunIcon} />
      ) : (
        <FiMoon size={20} className={styles.moonIcon} />
      )}
    </button>
  )
} 