'use client';

import { useState, useEffect } from 'react';
import styles from './notification.module.css';
import api from '@/lib/axios';

/**
 * 알림 설정 상태를 정의하는 인터페이스
 * @property {boolean} RESERVATION - 예약 알림 활성화 여부
 * @property {boolean} RESERVATION_STATUS - 예약 상태 알림 활성화 여부
 * @property {boolean} COMMENT - 댓글 알림 활성화 여부
 */
interface NotificationSettings {
  RESERVATION: boolean;
  RESERVATION_STATUS: boolean;
  COMMENT: boolean;
}

/**
 * 사용자 정보를 정의하는 인터페이스
 * @property {string} userType - 사용자 타입 ('HOST' 또는 'USER')
 */
interface UserInfo {
  userType: 'HOST' | 'USER';
}

/**
 * 알림 설정 토글 컴포넌트
 * 사용자 타입에 따라 다른 알림 설정 옵션을 제공하고,
 * 각 알림 설정의 활성화/비활성화 상태를 관리합니다.
 */
export default function NotificationToggle() {
  // 알림 설정 상태 관리
  const [settings, setSettings] = useState<NotificationSettings>({
    RESERVATION: true,
    RESERVATION_STATUS: true,
    COMMENT: true
  });

  // 사용자 정보 상태 관리
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  /**
   * 사용자 정보를 서버에서 가져오는 useEffect
   * 컴포넌트 마운트 시 실행되며, 사용자의 타입(HOST/USER)을 설정합니다.
   */
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/api/v1/users/me');
        setUserInfo(response.data.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  /**
   * 알림 설정을 서버에서 가져오는 useEffect
   * 컴포넌트 마운트 시 실행되며, 사용자의 현재 알림 설정 상태를 가져옵니다.
   */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/v1/notifications/settings');
        setSettings(response.data.data);
      } catch (error) {
        console.error('알림 설정 조회 실패:', error);
      }
    };

    fetchSettings();
  }, []);

  /**
   * 알림 설정 변경 핸들러
   * 토글 버튼 클릭 시 호출되며, 서버에 변경된 설정을 저장합니다.
   * @param {keyof NotificationSettings} type - 변경할 알림 설정의 타입
   */
  const handleToggle = async (type: keyof NotificationSettings) => {
    try {
      const newSettings = { ...settings, [type]: !settings[type] };
      
      // 서버에 설정 변경 요청
      await api.post('/api/v1/notifications/settings', {
        type,
        enabled: newSettings[type]
      });

      // 로컬 상태 업데이트
      setSettings(newSettings);
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      alert('설정 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  /**
   * 알림 유형별 설정 정보
   * 각 알림 유형의 제목, 설명, 그리고 어떤 사용자 타입에게 보여줄지 정의합니다.
   */
  const notificationTypes = {
    RESERVATION: {
      title: '예약 알림',
      description: '새로운 예약이 들어왔을 때 알림을 받습니다.',
      showForUserTypes: ['HOST'] // 호스트에게만 표시
    },
    RESERVATION_STATUS: {
      title: '예약 상태 알림',
      description: '예약 상태가 변경되었을 때 알림을 받습니다.',
      showForUserTypes: ['HOST', 'USER'] // 모든 사용자에게 표시
    },
    COMMENT: {
      title: '댓글 알림',
      description: '새로운 댓글이나 답글이 달렸을 때 알림을 받습니다.',
      showForUserTypes: ['HOST', 'USER'] // 모든 사용자에게 표시
    }
  };

  /**
   * 사용자 타입에 따라 필터링된 알림 설정 목록
   * 현재 사용자의 타입에 맞는 알림 설정만 필터링하여 반환합니다.
   */
  const filteredNotificationTypes = (Object.keys(settings) as Array<keyof NotificationSettings>).filter(
    type => userInfo && notificationTypes[type].showForUserTypes.includes(userInfo.userType)
  );

  return (
    <div className={styles.content}>
      {/* 헤더 섹션 */}
      <div className={styles.header}>
        <h1>알림 설정</h1>
        <p>알림을 받고 싶은 항목을 선택해주세요.</p>
      </div>

      {/* 알림 설정 목록 */}
      <div className={styles.settingsList}>
        {filteredNotificationTypes.map(type => (
          <div key={type} className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3>{notificationTypes[type].title}</h3>
              <p>{notificationTypes[type].description}</p>
            </div>
            {/* 토글 스위치 */}
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings[type]}
                onChange={() => handleToggle(type)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        ))}
      </div>

      {/* 푸터 섹션 */}
      <div className={styles.footer}>
        <p className={styles.note}>
          * 알림 설정을 변경하면 즉시 적용됩니다.
        </p>
      </div>
    </div>
  );
} 