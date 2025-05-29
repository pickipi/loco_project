'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { IoNotifications } from 'react-icons/io5'
import NotificationPanel from '../notification/notification'
import styles from './hostheader.module.css'
import api from '@/lib/axios'

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

export default function HostHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // 알림 관련 상태 추가
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationRef = useRef<HTMLDivElement>(null)

  // 알림 패널 외부 클릭 시 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 읽지 않은 알림 개수를 가져오는 함수
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await api.get<ApiResponse<number>>('/api/v1/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUnreadCount(response.data.data)
    } catch (error) {
      console.error('읽지 않은 알림 개수 조회 실패:', error)
    }
  }

  // 초기 읽지 않은 알림 개수 조회 및 주기적 업데이트
  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000) // 30초마다 갱신
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

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
        setUserId(payload.userId)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Token parsing error:', error)
        setIsLoggedIn(false)
      }
    } else {
      setIsLoggedIn(false)
    }
    setIsLoading(false)
  }, [])

  // 보호된 경로 접근 핸들러
  const handleProtectedRoute = (path: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/host/login')
      return
    }
    router.push(path)
  }

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUserEmail(null)
    setIsLoggedIn(false)
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

          {/* Auth Buttons */}
          <div className={styles.authContainer}>
            {isLoggedIn ? (
              <>
                {/* 알림 아이콘 추가 */}
                <div className={styles.notificationContainer} ref={notificationRef}>
                  <button 
                    className={styles.notificationButton}
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <IoNotifications size={24} />
                    {unreadCount > 0 && (
                      <span className={styles.notificationBadge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationOpen && (
                    <div className={styles.notificationPanel}>
                      <NotificationPanel 
                        userId={userId || 0}
                        jwtToken={localStorage.getItem('token') || ''}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleProtectedRoute('/host/profile')}
                  className={styles.navLink}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>{userEmail}님</span>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  로그아웃
                </button>
              </>
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

        {/* Mobile menu */}
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
                {/* 모바일 알림 메뉴 아이템 */}
                <button 
                  className={styles.mobileMenuItem}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <div className={styles.mobileNotificationItem}>
                    <IoNotifications size={20} />
                    <span className={styles.mobileMenuText}>알림</span>
                    {unreadCount > 0 && (
                      <span className={styles.mobileNotificationBadge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleProtectedRoute('/host/profile')}
                  className={styles.mobileMenuItem}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>{userEmail}님</span>
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
