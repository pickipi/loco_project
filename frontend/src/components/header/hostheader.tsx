'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './hostheader.module.css'

interface HostHeaderProps {
  isLoggedIn: boolean;
  username?: string;
  onLogout: () => void;
}

export default function HostHeader({ isLoggedIn, username, onLogout }: HostHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        const payload = JSON.parse(jsonPayload)
      } catch (error) {
        console.error('Token parsing error:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const handleProtectedRoute = (path: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/login')
      return
    }
    router.push(path)
  }

  if (isLoading) {
    return null
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Link href="/host" className={styles.logoLink}>
              <span className={styles.logoText}>LOCO</span>
              <span className={styles.logoSubtext}>호스트센터</span>
            </Link>
          </div>

          <nav className={styles.desktopNav}>
            <button 
              onClick={() => handleProtectedRoute('/host/spaces/register')}
              className={styles.navLink}
            >
              공간작성
            </button>
            <button 
              onClick={() => handleProtectedRoute('/host/spaces')}
              className={styles.navLink}
            >
              공간관리
            </button>
            <button
              onClick={() => handleProtectedRoute('/host/bookings')}
              className={styles.navLink}
            >
              예약관리
            </button>
            <button
              onClick={() => handleProtectedRoute('/host/revenue')}
              className={styles.navLink}
            >
              정산관리
            </button>
          </nav>

          <div className={styles.authContainer}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleProtectedRoute('/host/profile')}
                  className={styles.navLink}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>{username}님</span>
                <button
                  onClick={onLogout}
                  className={styles.logoutButton}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className={styles.loginButton}
              >
                로그인
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.mobileMenuButton}
          >
            <span className="sr-only">메뉴 열기</span>
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

        {isMenuOpen && (
          <div className={styles.mobileMenuContainer}>
            <button
              onClick={() => handleProtectedRoute('/host/spaces')}
              className={styles.mobileMenuItem}
            >
              공간관리
            </button>
            <button
              onClick={() => handleProtectedRoute('/host/bookings')}
              className={styles.mobileMenuItem}
            >
              예약관리
            </button>
            <button
              onClick={() => handleProtectedRoute('/host/revenue')}
              className={styles.mobileMenuItem}
            >
              정산관리
            </button>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleProtectedRoute('/host/profile')}
                  className={styles.mobileMenuItem}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>{username}님</span>
                <button
                  onClick={onLogout}
                  className={styles.mobileMenuItem}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
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
