'use client';

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message, Frame } from '@stomp/stompjs';
import api from '@/lib/axios';
import styles from './notification.module.css';

/**
 * 알림 정보 인터페이스
 */
interface Notification {
  id: number;          // 알림 고유 ID
  content: string;     // 알림 내용
  isRead: boolean;     // 읽음 여부
  type: string;        // 알림 타입
  createdAt: string;   // 생성 시간
}

/**
 * 알림 패널 컴포넌트 Props
 */
interface NotificationPanelProps {
  userId: number;      // 사용자 ID
  jwtToken: string;    // JWT 토큰
}

/**
 * API 응답 데이터 인터페이스
 */
interface ApiResponse<T> {
  data: T;             // 응답 데이터
  message: string;     // 응답 메시지
  status: string;      // 응답 상태
}

/**
 * 알림 패널 컴포넌트
 * 
 * 주요 기능:
 * 1. 실시간 알림 수신 (WebSocket)
 * 2. 알림 목록 조회
 * 3. 알림 읽음 처리
 * 4. 알림 삭제
 * 5. 연결 상태 표시
 */
const NotificationPanel: React.FC<NotificationPanelProps> = ({ userId, jwtToken }) => {
  // 알림 목록 상태
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // WebSocket 연결 상태
  const [isConnected, setIsConnected] = useState(false);

  /**
   * 알림 목록을 서버에서 조회하는 함수
   */
  const fetchNotifications = async () => {
    try {
      const res = await api.get<ApiResponse<Notification[]>>('/api/v1/notifications', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      setNotifications(res.data.data);
    } catch (error) {
      console.error('알림 목록 가져오기 실패:', error);
    }
  };

  /**
   * 알림을 읽음 처리하는 함수
   */
  const markAsRead = async (id: number) => {
    try {
      await api.post<ApiResponse<void>>(`/api/v1/notifications/${id}/read`, null, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      fetchNotifications(); // 목록 갱신
    } catch (error) {
      console.error('알림 읽음 실패:', error);
    }
  };

  /**
   * 알림을 삭제하는 함수
   */
  const deleteNotification = async (id: number) => {
    try {
      await api.delete<ApiResponse<void>>(`/api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      // 삭제된 알림을 목록에서 제거
      setNotifications(prev => prev.filter(noti => noti.id !== id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  // WebSocket 연결 및 알림 구독 설정
  useEffect(() => {
    fetchNotifications(); // 초기 알림 목록 로드

    // WebSocket 연결 설정
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket 연결됨');
        setIsConnected(true);
        // 사용자별 알림 토픽 구독
        client.subscribe(`/topic/notifications/${userId}`, (message: Message) => {
          try {
            const newNotification: Notification = JSON.parse(message.body);
            // 새 알림을 목록 최상단에 추가
            setNotifications((prev) => [newNotification, ...prev]);
          } catch (error) {
            console.error('알림 메시지 파싱 실패:', error);
          }
        });
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 끊김');
        setIsConnected(false);
      },
      onStompError: (frame: Frame) => {
        console.error('STOMP 오류:', frame.body);
        setIsConnected(false);
      }
    });

    // WebSocket 연결 시작
    client.activate();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      client.deactivate();
    };
  }, [userId, jwtToken]);

  return (
    <div className={styles.notificationContainer}>
      {/* 헤더 영역: 제목과 연결 상태 표시 */}
      <div className={styles.header}>
        <h3 className={styles.title}>🔔 알림</h3>
        <span className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </span>
      </div>

      {/* 알림 목록 또는 빈 상태 메시지 */}
      {notifications.length === 0 ? (
        <p className={styles.emptyMessage}>알림이 없습니다.</p>
      ) : (
        <ul className={styles.notificationList}>
          {notifications.map((noti) => (
            <li 
              key={noti.id} 
              className={`${styles.notificationItem} ${noti.isRead ? styles.read : styles.unread}`}
            >
              <div className={styles.notificationContent}>
                <div className={styles.messageContainer}>
                  <p className={styles.message}>{noti.content}</p>
                  <span className={styles.date}>
                    {new Date(noti.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className={styles.actionButtons}>
                  {/* 읽지 않은 알림만 읽음 버튼 표시 */}
                  {!noti.isRead && (
                    <button 
                      onClick={() => markAsRead(noti.id)}
                      className={styles.readButton}
                    >
                      읽음
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(noti.id)}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
