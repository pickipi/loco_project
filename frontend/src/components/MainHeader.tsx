"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username"); // 앞에서 저장한 ID 부분
    if (token && username) {
      setIsLoggedIn(true);
      setDisplayName(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setDisplayName(null);
    router.push("/");  // 로그아웃 후 홈으로
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl">LoCo</Link>
        <div className="flex items-center gap-4">
          {isLoggedIn && displayName ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">{displayName}님</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-800 text-sm"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 