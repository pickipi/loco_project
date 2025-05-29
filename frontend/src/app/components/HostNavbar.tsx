'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HostNavbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const updateLoginState = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    
    if (token && role === 'HOST') {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  useEffect(() => {
    // 초기 상태 설정
    updateLoginState();

    // storage 이벤트 리스너
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'role' || e.key === 'username') {
        updateLoginState();
      }
    };

    // 커스텀 이벤트 리스너
    const handleLoginStateChange = () => {
      updateLoginState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStateChange', handleLoginStateChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    // 상태 업데이트
    updateLoginState();
    
    // 로그아웃 이벤트 발생
    window.dispatchEvent(new Event('loginStateChange'));
    
    router.push('/host/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/host" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">LoCo Host</span>
            </Link>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <span className="mr-4">안녕하세요, {username}님</span>
                <Link href="/host/spaces" className="mr-4 text-blue-600 hover:text-blue-800">
                  공간 작성
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/host/login" className="text-gray-600 hover:text-gray-800 mr-4">
                  로그인
                </Link>
                <Link href="/host/signup" className="text-gray-600 hover:text-gray-800">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 