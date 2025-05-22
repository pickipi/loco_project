"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="font-bold text-2xl">
              <Image
                src="/logo.png"
                alt="LoCo Logo"
                width={80}
                height={30}
                className="object-contain"
              />
            </Link>

            {/* Navigation */}
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
            </nav>
          </div>

          {/* Right section - Search, Login, Sign up */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                placeholder="공간 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[280px] pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
