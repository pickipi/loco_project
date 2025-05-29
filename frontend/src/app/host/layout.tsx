
'use client'

import { Inter } from 'next/font/google'
import HostHeader from '@/components/header/hostheader'
import { ThemeProvider } from '@/components/darkmode/ThemeContext'
import { usePathname } from 'next/navigation'

import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HostHeader from '@/components/header/hostheader'
import React, { useEffect, useState } from 'react';
import HostNavbar from '../components/HostNavbar';
import { AuthContext, AuthContextType } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] })

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const isMainPage = pathname === '/host'

  return (
    <ThemeProvider>
      <div className={inter.className} style={{ 
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        color: 'var(--text-primary)'
      }}>
        <HostHeader />
        <main style={{ 
          paddingTop: '64px',
          backgroundColor: 'var(--bg-primary)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{
            maxWidth: isMainPage ? '100%' : '1200px',
            margin: '0 auto',
            padding: isMainPage ? '0' : '24px'
          }}>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // 페이지 로드 시 localStorage에서 로그인 정보 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
      setUserName(null);
    }
  }, []);

  // 로그인 함수: localStorage에 정보 저장 및 상태 업데이트
  const login = (token: string, id: string, name: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('userName', name);
    setIsLoggedIn(true);
    setUserId(id);
    setUserName(name);
  };

  // 로그아웃 함수: localStorage에서 정보 삭제 및 상태 업데이트
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
  };

  const authContextValue: AuthContextType = { isLoggedIn, userId, userName, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className={`${inter.className} min-h-screen`}>
        <HostHeader />
        <HostNavbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  )
} 