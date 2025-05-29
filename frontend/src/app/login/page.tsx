'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { SiNaver, SiKakaotalk } from 'react-icons/si';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '로그인 실패');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      alert('로그인 성공!');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakao = () => {
    window.location.href = `${API}/oauth2/authorization/kakao`;
  };

  const handleNaver = () => {
    window.location.href = `${API}/oauth2/authorization/naver`;
  };

  const handleApple = () => {
    window.location.href = `${API}/oauth2/authorization/apple`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-gray-100">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex justify-center">
          <Link href="/" className="font-bold text-2xl md:text-3xl">
            LoCo
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">게스트 로그인</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleNaver}
              className="w-full py-3 px-4 flex items-center justify-center bg-[#03C75A] text-white rounded-md transition-all duration-200 hover:bg-[#02b351] hover:scale-[1.02] active:scale-[0.98]"
            >
              <SiNaver className="mr-2" size={20} />
              네이버로 로그인
            </button>
            <button
              type="button"
              onClick={handleKakao}
              className="w-full py-3 px-4 flex items-center justify-center bg-[#FEE500] text-black rounded-md transition-all duration-200 hover:bg-[#f4db00] hover:scale-[1.02] active:scale-[0.98]"
            >
              <SiKakaotalk className="mr-2" size={20} />
              카카오로 로그인
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-gray-500 text-sm">또는</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          
          {/* Email Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">이메일</label>
                <input
                  id="email"
                  type="email"
                  placeholder="이메일"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    로그인 기억하기
                  </label>
                </div>
                <Link href="/login/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                  비밀번호 찾기
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </div>
            </div>
          </form>
          
          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              아직 LoCo 회원이 아니신가요? {' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© 2025 LoCo Inc. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">이용약관</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">개인정보처리방침</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">운영정책</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">고객 문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 