'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './hostheader.module.css'

export default function HostHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // JWT 토큰 디코딩
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        const payload = JSON.parse(jsonPayload)
        // 이메일에서 @ 앞부분만 추출해서 사용자이름 보이게
        const emailPrefix = payload.sub.split('@')[0]
        setUserEmail(emailPrefix)
      } catch (error) {
        console.error('Token parsing error:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // 공간관리 클릭 핸들러
  const handleSpaceManagement = () => {
    if (isLoading) return // 로딩 중이면 아무것도 하지 않음
    
    if (!userEmail) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/host/login')
      return
    }
    router.push('/host/space/register')
  }

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUserEmail(null)
    router.push('/host/login')
  }

  // 로딩 중이면 아무것도 렌더링하지 않음
  if (isLoading) {
    return null
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
            {userEmail ? (
              <div className={styles.authContainer}>
                <button className={styles.navLink}>
                  알림
                </button>
                <Link 
                  href="/host/profile" 
                  className={styles.navLink}
                >
                  {userEmail}님
                </Link>
                <button 
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  로그아웃
                </button>
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
        {isMenuOpen && (
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
            {userEmail ? (
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
                  {userEmail}님
                </Link>
                <button
                  onClick={handleLogout}
                  className={styles.mobileMenuItem}
                >
                  로그아웃
                </button>
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
        )}
      </div>
    </header>
  )
}
