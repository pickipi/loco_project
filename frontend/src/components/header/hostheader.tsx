"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoNotifications } from "react-icons/io5";
// import NotificationPanel from "../notification/notification";
import styles from "./hostheader.module.css";
import api from "@/lib/axios";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [realName, setRealName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 알림 관련 상태 추가
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRealName = localStorage.getItem("realName");

    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "");
      setRealName(storedRealName || "");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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

  // 읽지 않은 알림 개수를 가져오는 함수 수정
  /*
  const fetchNotificationsAndCountUnread = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log('토큰이 없습니다.');
        setUnreadCount(0);
        return;
      }

      // 호스트용 알림 API 엔드포인트로 수정
      const response = await api.get<ApiResponse<Notification[]>>("/api/v1/host/notifications");

      if (response.data && Array.isArray(response.data.data)) {
        // 읽지 않은 알림 개수 계산
        const unread = response.data.data.filter((noti) => !noti.isRead).length;
        setUnreadCount(unread);
      } else {
        console.error("알림 데이터 형식이 올바르지 않습니다:", response.data);
        setUnreadCount(0);
      }

    } catch (error: any) {
      console.error("알림 목록 및 읽지 않은 개수 조회 실패:", error);
      
      if (error.response) {
        // HTTP 에러 응답이 있는 경우
        switch (error.response.status) {
          case 401:
            console.log('알림 조회 중 인증 만료 (401).');
            handleLogout();
            toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
            break;
          case 403:
            console.log('알림 조회 권한 없음 (403).');
            toast.error('알림을 조회할 권한이 없습니다.');
            break;
          case 500:
            console.log('서버 내부 오류 (500).');
            toast.error('서버에서 알림을 가져오는 중 오류가 발생했습니다.');
            break;
          default:
            console.error('알림 조회 중 기타 에러:', error);
            toast.error('알림을 가져오는 중 문제가 발생했습니다.');
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('알림 서버 응답 없음:', error.request);
        toast.error('알림 서버에 연결할 수 없습니다.');
      } else {

        // 요청 설정 중 발생한 오류
        console.error('알림 요청 설정 오류:', error.message);
        toast.error('알림 요청을 설정하는 중 오류가 발생했습니다.');
      }
      setUnreadCount(0);
    }
  }
  };
  */

  // 초기 읽지 않은 알림 개수 조회 및 주기적 업데이트
  /*
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotificationsAndCountUnread(); // 초기 로드
      const interval = setInterval(fetchNotificationsAndCountUnread, 30000); // 30초마다 갱신
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    } else {
      setUnreadCount(0); // 로그인 상태가 아니면 알림 카운트 0으로 초기화
    }
  }, [isLoggedIn]);
  */

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
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    setRealName("");
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
                {/* 알림 아이콘 추가 - 임시 비활성화 */}
                {/*
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
                        userId={parseInt(username) || 0}
                        jwtToken={localStorage.getItem("token") || ""}
                      />
                    </div>
                  )}
                </div>
                */}
                <button
                  onClick={() => handleProtectedRoute("/host/profile")}
                  className={styles.navLink}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>
                  {realName || username}님
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
                {/* 모바일 알림 메뉴 아이템 - 임시 비활성화 */}
                {/*
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
                */}
                <button
                  onClick={() => handleProtectedRoute("/host/profile")}
                  className={styles.mobileMenuItem}
                >
                  프로필
                </button>
                <span className={styles.userEmail}>
                  {realName || username}님
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
