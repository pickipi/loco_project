'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HostHeaderProps {
  isLoggedIn?: boolean
}

export default function HostHeader({ isLoggedIn = false }: HostHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  // 공간관리 클릭 핸들러
  const handleSpaceManagement = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/host/login')
      return
    }
    router.push('/host/space/register')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#7047EB] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/host" className="flex items-center">
              <span className="text-xl font-bold">LOCO</span>
              <span className="ml-2 text-sm">호스트센터</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleSpaceManagement}
              className="text-white hover:text-gray-200 transition"
            >
              공간관리
            </button>
            <Link 
              href="/host/bookings" 
              className="text-white hover:text-gray-200 transition"
            >
              예약관리
            </Link>
            <Link 
              href="/host/revenue" 
              className="text-white hover:text-gray-200 transition"
            >
              정산관리
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button className="hover:text-gray-200 transition">
                  알림
                </button>
                <Link 
                  href="/host/profile" 
                  className="hover:text-gray-200 transition"
                >
                  프로필
                </Link>
              </div>
            ) : (
              <Link 
                href="/host/login" 
                className="bg-white text-[#7047EB] px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-gray-200 hover:bg-[#8561ED] transition"
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
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={handleSpaceManagement}
                className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-[#8561ED] transition"
              >
                공간관리
              </button>
              <Link
                href="/host/bookings"
                className="block px-3 py-2 rounded-md text-white hover:bg-[#8561ED] transition"
              >
                예약관리
              </Link>
              <Link
                href="/host/revenue"
                className="block px-3 py-2 rounded-md text-white hover:bg-[#8561ED] transition"
              >
                정산관리
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/host/notifications"
                    className="block px-3 py-2 rounded-md text-white hover:bg-[#8561ED] transition"
                  >
                    알림
                  </Link>
                  <Link
                    href="/host/profile"
                    className="block px-3 py-2 rounded-md text-white hover:bg-[#8561ED] transition"
                  >
                    프로필
                  </Link>
                </>
              ) : (
                <Link
                  href="/host/login"
                  className="block px-3 py-2 rounded-md bg-white text-[#7047EB] hover:bg-gray-100 transition"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
