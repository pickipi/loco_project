"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface MainHeaderProps {
  onSearch?: (query: string) => void;
}

export default function MainHeader({ onSearch }: MainHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 체크 (임시로 localStorage 사용)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/spaces/search?query=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 좌측: 로고 및 네비게이션 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="LoCo"
              width={80}
              height={30}
              className="object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              홈
            </Link>
            <Link
              href="/spaces"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              공간
            </Link>

            {/* 로그인한 사용자에게만 보이는 메뉴 */}
            {isLoggedIn && (
              <>
                <Link
                  href="/chat"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  채팅
                </Link>
                <Link
                  href="/reservation"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  예약
                </Link>
                <Link
                  href="/payment"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  결제
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* 우측: 검색, 로그인/회원가입 */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="공간 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EDE7D4]"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>

          {isLoggedIn ? (
            <Link
              href="/mypage"
              className="text-gray-600 hover:text-gray-900 transition px-4 py-2"
            >
              마이페이지
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition px-4 py-2"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-[#40322F] text-white px-4 py-2 rounded-lg hover:bg-[#594a47] transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
