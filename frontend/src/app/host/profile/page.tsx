'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import DeleteAccountModal from './components/DeleteAccountModal';
import HostHeader from '@/components/header/hostheader';

// 이메일 첫 글자로 아바타 이미지 URL 생성
const getInitialAvatar = (email: string) => {
  const firstChar = email.charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${firstChar}&background=random&color=fff&bold=true&size=100`;
};

// 프로필 데이터 타입 정의
interface ProfileData {
  id: number;          // 사용자 고유 ID
  username: string;    // 사용자 이름
  email: string;       // 이메일 주소
  phoneNumber: string; // 전화번호
  marketingEmail: boolean; // 이메일 마케팅 수신 동의
  marketingSMS: boolean;   // SMS 마케팅 수신 동의
}

export default function HostProfile() {
  const router = useRouter();
  
  // 상태 관리
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    username: '',
    email: '',
    phoneNumber: '',
    marketingEmail: false,
    marketingSMS: false,
  });
  const [isLoading, setIsLoading] = useState(true);    // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 탈퇴 모달 표시 여부
  const [isDeleting, setIsDeleting] = useState(false); // 탈퇴 처리 중 상태

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('realName');
      const storedEmail = localStorage.getItem('email');
      const storedPhone = localStorage.getItem('phoneNumber');
      const token = localStorage.getItem('token');

      if (!storedUsername || !storedEmail || !token) {
        router.push('/host/login');
        return;
      }

      // JWT 토큰에서 userId 추출
      let userId = 0;
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        userId = parseInt(payload.sub) || 0;
      } catch (error) {
        console.error('토큰 파싱 오류:', error);
        router.push('/host/login');
        return;
      }

      setProfileData({
        id: userId,
        username: storedUsername,
        email: storedEmail,
        phoneNumber: storedPhone || '',
        marketingEmail: false,
        marketingSMS: false,
      });
      setIsLoading(false);
    }
  }, [router]);

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/host/${profileData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/host/login');
          return;
        }
        throw new Error('회원 탈퇴 처리 중 오류가 발생했습니다.');
      }

      localStorage.clear();
      router.push('/host/login');
    } catch (err) {
      console.error('회원 탈퇴 오류:', err);
      setError('회원 탈퇴 처리 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 마케팅 수신 동의 변경 처리
  const handleMarketingChange = async (type: 'email' | 'sms', value: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      setProfileData(prev => ({
        ...prev,
        [type === 'email' ? 'marketingEmail' : 'marketingSMS']: value,
      }));
    } catch (err) {
      console.error('마케팅 수신 설정 변경 오류:', err);
      setError('마케팅 수신 설정 변경에 실패했습니다.');
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return <div className={styles.loading}>로딩중...</div>;
  }

  // 에러 표시
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <HostHeader />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className={styles.container}>
          {/* 페이지 헤더 */}
          <div className={styles.header}>
            <h1>프로필 관리</h1>
          </div>

          <div className={styles.profileContent}>
            {/* 프로필 이미지 섹션 */}
            <div className={styles.profileImage}>
              <Image 
                src={getInitialAvatar(profileData.email)}
                alt={`${profileData.username}의 프로필`}
                width={100} 
                height={100} 
                className={styles.avatar}
              />
              <div className={styles.userName}>{profileData.username}</div>
              <Link href="/host/profile/image" className={styles.userType}>
                프로필 사진변경
              </Link>
            </div>

            {/* 프로필 상세 정보 */}
            <div className={styles.profileDetails}>
              {/* 이름 필드 */}
              <div className={styles.field}>
                <label>이름</label>
                <div className={styles.value}>
                  {profileData.username}
                  <button className={styles.editButton}>편집하기</button>
                </div>
              </div>

              {/* 이메일 필드 */}
              <div className={styles.field}>
                <label>이메일</label>
                <div className={styles.value}>
                  {profileData.email}
                  <button className={styles.editButton}>인증하기</button>
                </div>
              </div>

              {/* 연락처 필드 */}
              <div className={styles.field}>
                <label>연락처</label>
                <div className={styles.value}>
                  {profileData.phoneNumber}
                  <button className={styles.editButton}>인증번호</button>
                </div>
              </div>

              {/* 비밀번호 변경 링크 */}
              <div className={styles.field}>
                <label>비밀번호</label>
                <div className={styles.value}>
                  <Link href="/host/profile/changepassword" className={styles.editButton}>
                    변경하기
                  </Link>
                </div>
              </div>

              {/* 마케팅 수신 동의 섹션 */}
              <div className={styles.marketingSection}>
                <h3>마케팅 수신동의</h3>
                {/* 이메일 마케팅 동의 */}
                <div className={styles.marketingOption}>
                  <label>
                    <span>이메일</span>
                    <input
                      type="checkbox"
                      checked={profileData.marketingEmail}
                      onChange={(e) => handleMarketingChange('email', e.target.checked)}
                    />
                  </label>
                </div>
                {/* SMS 마케팅 동의 */}
                <div className={styles.marketingOption}>
                  <label>
                    <span>SMS</span>
                    <input
                      type="checkbox"
                      checked={profileData.marketingSMS}
                      onChange={(e) => handleMarketingChange('sms', e.target.checked)}
                    />
                  </label>
                </div>
                <p className={styles.marketingNote}>
                  마케팅 수신 동의 시, 다양한 혜택 정보를 받으실 수 있습니다.
                </p>
              </div>
            </div>

            {/* 회원 탈퇴 버튼 */}
            <div className={styles.footer}>
              <button 
                className={styles.deleteButton}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                서비스 탈퇴하기
              </button>
            </div>
          </div>

          {/* 회원 탈퇴 확인 모달 */}
          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
            isLoading={isDeleting}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="text-center text-sm text-gray-400">
          © 2025 LoCo Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
