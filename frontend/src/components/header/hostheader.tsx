"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoNotifications } from "react-icons/io5";
import NotificationPanel from "../notification/notification";
import styles from "./hostheader.module.css";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'react-toastify';

// Notification 인터페이스 정의
interface Notification {
  id: number;
  content: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

export default function HostHeader() {
  const router = useRouter();
  const {
    isLoggedIn,
    userName: authUserName,
    userId: authUserId,
    logout,
  } = useAuth(); // useAuth 훅으로 로그인 상태와 정보, 로그아웃 함수 가져오기
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 알림 관련 상태 추가
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  // 알림 패널 외부 클릭 시 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 토큰 유효성 검사 함수 추가
  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      const expirationTime = payload.exp * 1000;
      
      if (Date.now() >= expirationTime) {
        localStorage.removeItem('token');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('토큰 검증 중 오류:', error);
      return false;
    }
  };

  // 읽지 않은 알림 개수를 가져오는 함수 수정
  const fetchNotificationsAndCountUnread = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log('토큰이 없습니다.');
        setUnreadCount(0);
        return;
      }

      // 토큰 유효성 검사
      if (!validateToken()) {
        console.log('토큰이 유효하지 않습니다. (fetchNotificationsAndCountUnread)');
        setUnreadCount(0);
        return;
      }

      // 기존 알림 목록 엔드포인트 호출
      const response = await api.get<ApiResponse<Notification[]>>(
        "/api/v1/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 읽지 않은 알림 개수 계산
      const unread = response.data.data.filter((noti) => !noti.isRead).length;
      setUnreadCount(unread);
    } catch (error: any) {
      console.error("알림 목록 및 읽지 않은 개수 조회 실패:", error);
      
      // 401 에러 처리
      if (error.response && error.response.status === 401) {
        console.log('알림 조회 중 인증 만료 (401).');
        localStorage.removeItem('token');
        setUnreadCount(0);
        toast.error('인증이 만료되었습니다. 다시 로그인해주세요.', {
          onClose: () => {
            router.push('/host/login');
          }
        });
      } else {
        // 기타 에러 처리
        console.error('알림 조회 중 기타 에러:', error);
        // 필요에 따라 사용자에게 에러 알림을 표시할 수 있습니다.
      }
    }
  };

  // 초기 읽지 않은 알림 개수 조회 및 주기적 업데이트
  useEffect(() => {
    // isLoggedIn이 true이고, userId와 userName이 유효한 값일 때만 알림 조회 로직 실행
    if (isLoggedIn && authUserId && authUserName) {
      console.log('로그인 상태 확인됨. 알림 조회 시작.');
      fetchNotificationsAndCountUnread(); // 초기 로드
      const interval = setInterval(fetchNotificationsAndCountUnread, 30000); // 30초마다 갱신
      return () => {
        console.log('알림 조회 인터벌 클리어.');
        clearInterval(interval);
      } // 컴포넌트 언마운트 시 인터벌 정리
    } else {
      console.log('로그인 상태 아님. 알림 조회 중단.');
      setUnreadCount(0); // 로그인 상태가 아니면 알림 카운트 0으로 초기화
    }
  }, [isLoggedIn, authUserId, authUserName]); // isLoggedIn, authUserId, authUserName가 변경될 때마다 실행

  // 보호된 경로 접근 핸들러
  const handleProtectedRoute = (path: string) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/host/login");
      return;
    }
    router.push(path);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout(); // useAuth에서 제공하는 로그아웃 함수 호출
    router.push("/host/login");
  };

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
              onClick={() => handleProtectedRoute("/host/spaces/register")}
              className={styles.navLink}
            >
              공간작성
            </button>
            <button
              onClick={() => handleProtectedRoute("/host/spaces")}
              className={styles.navLink}
            >
              공간관리
            </button>
            <button
              onClick={() => handleProtectedRoute("/host/bookings")}
              className={styles.navLink}
            >
              예약관리
            </button>
            <button
              onClick={() => handleProtectedRoute("/host/revenue")}
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
                <div
                  className={styles.notificationContainer}
                  ref={notificationRef}
                >
                  <button
                    className={styles.notificationButton}
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <IoNotifications size={24} />
                    {unreadCount > 0 && (
                      <span className={styles.notificationBadge}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationOpen && (
                    <div className={styles.notificationPanel}>
                      <NotificationPanel
                        userId={authUserId ? Number(authUserId) : 0}
                        jwtToken={localStorage.getItem("token") || ""}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleProtectedRoute("/host/profile")}
                  className={styles.navLink}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>
                  {authUserName || "사용자"}님
                </span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/host/login" className={styles.loginButton}>
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
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenuContainer}>
            <button
              onClick={() => handleProtectedRoute("/host/spaces")}
              className={styles.mobileMenuItem}
            >
              공간관리
            </button>
            <button
              onClick={() => handleProtectedRoute("/host/bookings")}
              className={styles.mobileMenuItem}
            >
              예약관리
            </button>
            <button
              onClick={() => handleProtectedRoute("/host/revenue")}
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
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleProtectedRoute("/host/profile")}
                  className={styles.mobileMenuItem}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>
                  {authUserName || "사용자"}님
                </span>
                <button
                  onClick={handleLogout}
                  className={styles.mobileMenuItem}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/host/login" className={styles.mobileLoginButton}>
                로그인
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
