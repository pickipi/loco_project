'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    if (token && username && email) {
      // 로컬 스토리지에 토큰과 사용자 정보 저장
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        username,
        email,
        userType: 'HOST' // 또는 실제 사용자 타입에 맞게 설정
      }));

      // 메인 페이지로 리다이렉트
      router.push('/');
    } else {
      // 필요한 정보가 없으면 로그인 페이지로 리다이렉트
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">로그인 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
} 