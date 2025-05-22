'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IoNotifications } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import NotificationPanel from '../notification/notification';
import api from '@/lib/axios';
import styles from './hostheader.module.css';

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

/**
 * 호스트 로그인 헤더 컴포넌트
 * 
 * 주요 기능:
 * 1. 로고 및 네비게이션 메뉴 표시
 * 2. 알림 아이콘 및 알림 개수 표시
 * 3. 모바일 반응형 메뉴
 * 4. 프로필 버튼
 */
export default function HostLoginHeader() {
  // 모바일 메뉴 열림/닫힘 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 알림 패널 열림/닫힘 상태 관리
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // 읽지 않은 알림 개수 상태 관리
  const [unreadCount, setUnreadCount] = useState(0);
  // 알림 패널 외부 클릭 감지를 위한 ref
  const notificationRef = useRef<HTMLDivElement>(null);

  // 임시로 사용할 userId와 token (실제로는 로그인 상태에서 가져와야 함)
  const userId = 1; // 실제 구현 시에는 로그인한 사용자의 ID를 사용
  const jwtToken = 'your-token'; // 실제 구현 시에는 로그인한 사용자의 토큰을 사용

  /**
   * 읽지 않은 알림 개수를 가져오는 함수
   */
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get<ApiResponse<number>>('/api/v1/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      setUnreadCount(response.data.data);
    } catch (error) {
      console.error('읽지 않은 알림 개수 조회 실패:', error);
    }
  };

  // 알림 패널 외부 클릭 시 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 초기 읽지 않은 알림 개수 조회 및 주기적 업데이트
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30초마다 갱신

    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* 로고 영역 */}
          <div className={styles.logoContainer}>
            <Link href="/host/dashboard" className={styles.logoLink}>
              <span className={styles.logoText}>LOCO</span>
              <span className={styles.logoSubtext}>호스트</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 메뉴 */}
          <nav className={styles.desktopNav}>
            <Link href="/host/spaces" className={styles.navLink}>
              공간 관리
            </Link>
            <Link href="/host/reservations" className={styles.navLink}>
              예약 관리
            </Link>
            <Link href="/host/settings" className={styles.navLink}>
              설정
            </Link>
          </nav>

          {/* 알림 및 프로필 영역 */}
          <div className={styles.authContainer}>
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
              {/* 알림 패널 */}
              {isNotificationOpen && (
                <div className={styles.notificationPanel}>
                  <NotificationPanel 
                    userId={userId} 
                    jwtToken={jwtToken}
                  />
                </div>
              )}
            </div>
            <button className={styles.loginButton}>
              프로필
            </button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <RxHamburgerMenu size={24} />
          </button>
        </div>

        {/* 모바일 메뉴 - 메뉴가 열려있을 때만 표시 */}
        {isMobileMenuOpen && (
          <div className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}>
            <div className={styles.mobileMenuContainer}>
              <Link href="/host/spaces" className={styles.mobileMenuItem}>
                공간 관리
              </Link>
              <Link href="/host/reservations" className={styles.mobileMenuItem}>
                예약 관리
              </Link>
              <Link href="/host/settings" className={styles.mobileMenuItem}>
                설정
              </Link>
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
              <button className={styles.mobileLoginButton}>
                프로필
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
