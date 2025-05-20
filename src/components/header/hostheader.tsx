'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './hostheader.module.css'

interface HostHeaderProps {
  isLoggedIn?: boolean
}

export default function HostHeader({ isLoggedIn = false }: HostHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  // 공간관리 클릭 핸들러
  const handleSpaceManagement = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/host/login')
      return
    }
    router.push('/host/space/register')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href="/host" className={styles.logoLink}>
              <span className={styles.logoText}>LOCO</span>
              <span className={styles.logoSubtext}>호스트센터</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <button 
              onClick={handleSpaceManagement}
              className={styles.navLink}
            >
              공간관리
            </button>
            <Link 
              href="/host/bookings" 
              className={styles.navLink}
            >
              예약관리
            </Link>
            <Link 
              href="/host/revenue" 
              className={styles.navLink}
            >
              정산관리
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className={styles.authContainer}>
            {isLoggedIn ? (
              <div className={styles.authContainer}>
                <button className={styles.navLink}>
                  알림
                </button>
                <Link 
                  href="/host/profile" 
                  className={styles.navLink}
                >
                  프로필
                </Link>
              </div>
            ) : (
              <Link 
                href="/host/login" 
                className={styles.loginButton}
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.mobileMenuButton}
            >
              <span className="sr-only">메뉴 열기</span>
              {/* 햄버거 아이콘 */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuContainer}>
            <button
              onClick={handleSpaceManagement}
              className={styles.mobileMenuItem}
            >
              공간관리
            </button>
            <Link
              href="/host/bookings"
              className={styles.mobileMenuItem}
            >
              예약관리
            </Link>
            <Link
              href="/host/revenue"
              className={styles.mobileMenuItem}
            >
              정산관리
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/host/notifications"
                  className={styles.mobileMenuItem}
                >
                  알림
                </Link>
                <Link
                  href="/host/profile"
                  className={styles.mobileMenuItem}
                >
                  프로필
                </Link>
              </>
            ) : (
              <Link
                href="/host/login"
                className={styles.mobileLoginButton}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
