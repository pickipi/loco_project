"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiSearch, FiBell, FiUser } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 클라이언트 사이드에서만 Local Storage 접근
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      setUsername('');
      alert('로그아웃되었습니다.');
      // 필요한 경우 로그아웃 후 리다이렉트
      // window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-3 md:py-4 flex items-center justify-between">
          <button className="p-2">
            <FiMenu className="text-gray-600 text-xl" />
          </button>
          
          <Link href="/" className="font-bold text-2xl md:text-3xl">
            LoCo
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FiSearch className="text-gray-500 mr-2 text-lg" />
              <input 
                type="text" 
                placeholder="어떤 공간을 찾으세요?" 
                className="bg-transparent border-none outline-none text-base w-48"
              />
            </div>
            
            {isLoggedIn ? (
              // 로그인 상태일 때 표시
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-gray-700">{username}님 환영합니다!</span>
                <button 
                  onClick={handleLogout} 
                  className="text-base font-medium text-gray-600 hover:text-gray-900"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              // 로그인 상태가 아닐 때 표시
              <Link href="/login" className="ml-2 text-base font-medium hover:text-blue-500">로그인</Link>
            )}
            
            <button className="p-2">
              <FiBell className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Carousel Section */}
        <section className="relative bg-red-500 text-white my-4 rounded-xl overflow-hidden">
          <div className="mx-auto px-4 py-6 flex items-center justify-between">
            <button className="absolute left-2 bg-white/20 rounded-full p-2 z-10">
              <IoIosArrowBack className="text-white" />
            </button>
            
            <div className="flex-1 z-0 ml-8">
              <div className="flex items-center mb-2">
                <span className="bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center mr-2">i</span>
                <h2 className="text-xl font-bold">파티룸 찾을 때 주의 할인 받으세요</h2>
              </div>
              <p className="text-sm">지금 제휴 혜택을 확인하기</p>
            </div>
            
            <div className="w-20 h-20 bg-white/20 rounded-md"></div>
          </div>
          <div className="absolute bottom-2 right-4 text-xs text-white">
            1/3
          </div>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2 z-10">
            <IoIosArrowForward className="text-white" />
          </button>
        </section>

        {/* Category Navigation */}
        <section className="py-4">
          <div className="mx-auto">
            <h3 className="text-lg font-medium mb-3">찾는 공간이 있나요?</h3>
            
            <div className="flex mb-3 overflow-x-auto">
              <button className="px-4 py-1 border-b-2 border-black font-medium whitespace-nowrap">전체</button>
              <button className="px-4 py-1 text-gray-500 whitespace-nowrap">인기</button>
              <button className="px-4 py-1 text-gray-500 whitespace-nowrap">학원</button>
              <button className="px-4 py-1 text-gray-500 whitespace-nowrap">레저</button>
              <button className="px-4 py-1 text-gray-500 whitespace-nowrap">오피스</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { name: "카페", icon: "☕" },
                { name: "파티룸", icon: "🎉" },
                { name: "공유오피스", icon: "💼" },
                { name: "스튜디오", icon: "📸" },
                { name: "연습실", icon: "🎵" },
                { name: "강의실/세미나", icon: "👨‍🏫" },
                { name: "스포츠/댄스", icon: "🏀" },
                { name: "악기연습실", icon: "🎹" },
                { name: "녹음실", icon: "🎤" },
                { name: "카페", icon: "☕" },
                { name: "캠핑장", icon: "⛺" },
                { name: "주방", icon: "🍳" }
              ].map((category, index) => (
                <div key={index} className="flex flex-col items-center mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1 text-xl">
                    {category.icon}
                  </div>
                  <span className="text-xs">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Large Banner */}
        <section className="py-3">
          <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[16/9] flex items-center justify-center relative">
            <div className="text-white absolute left-6 bottom-10">
              <h3 className="text-lg font-bold">인생샷 보장하는</h3>
              <h3 className="text-lg font-bold">스튜디오 추천</h3>
              <button className="bg-white text-black text-xs px-3 py-1 rounded-full mt-2">바로가기</button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                <Image 
                  src="/placeholder.svg" 
                  alt="이미지 아이콘" 
                  width={32} 
                  height={32}
                  className="opacity-30"
                />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1 rounded">
              1/5
            </div>
          </div>
        </section>

        {/* Popular Spaces */}
        <section className="py-4">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">인기 공간</h3>
              <Link href="/spaces/popular" className="text-xs text-gray-500">
                더보기
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "도심 속 힐링 우드팜", location: "서울 · 강남", price: "25,000원", isHot: true },
                { name: "모던한 스튜디오", location: "서울 · 강남", price: "25,000원", isHot: false },
                { name: "어반풍 모임공간", location: "서울 · 잠실", price: "20,000원", isHot: false },
                { name: "감성 카페 카페공간", location: "경기 · 일산북구", price: "30,000원", isHot: true }
              ].map((space, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-sm">
                  <div className="relative pb-[70%] bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      이미지
                    </div>
                    {space.isHot && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-sm">{space.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{space.location}</p>
                    <p className="text-xs font-medium">시간당 {space.price}</p>
                    <div className="flex items-center mt-1">
                      <div className="text-yellow-400 text-xs">★★★★☆</div>
                      <span className="text-xs text-gray-500 ml-1">(123)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="py-4">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">테마 기획전</h3>
              <Link href="/themes" className="text-xs text-gray-500">
                더보기
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "감성 카페 추천팜", desc: "도심 속 힐링하기 좋은한 장소", location: "서울, 송파 외 다수" },
                { name: "인스타 스튜디오", desc: "사진 찍기 좋은 인생 스튜디오", location: "서울, 마포 외 다수" },
                { name: "모임하기 좋은 공간", desc: "다양한 크기의 모임에 딱 맞는 공간", location: "경기, 인천 외 다수" }
              ].map((theme, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <div className="relative pb-[60%] bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      이미지
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                    <div className="flex items-center my-1">
                      <div className="text-yellow-400 text-xs">★★★★★</div>
                      <span className="text-xs text-gray-500 ml-1">(5)</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {theme.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Spaces */}
        <section className="py-4">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">신규 공간</h3>
              <Link href="/spaces/new" className="text-xs text-gray-500">
                더보기
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "모던 미니멀 스튜디오", location: "경남 · 마산", price: "20,000원" },
                { name: "자연광 카페한 공간", location: "서울 · 홍대", price: "22,000원" },
                { name: "모던한 강남 카페", location: "서울 · 강남", price: "25,000원" },
                { name: "프라이빗 파티룸", location: "경기 · 수원", price: "30,000원" }
              ].map((space, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-sm">
                  <div className="relative pb-[70%] bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      이미지
                    </div>
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-sm">{space.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{space.location}</p>
                    <p className="text-xs font-medium">시간당 {space.price}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <div className="text-yellow-400 text-xs">★★★★☆</div>
                        <span className="text-xs text-gray-500 ml-1">(45)</span>
                      </div>
                      <span className="text-xs text-gray-400">찜 0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Spaces */}
        <section className="py-6 border-t border-gray-100">
          <div className="mx-auto">
            <h3 className="text-lg font-medium mb-4">지역별 공간</h3>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {["서울", "경기", "인천", "부산", "대구", "대전", "광주", "제주"].map((region) => (
                <Link 
                  key={region} 
                  href={`/spaces/region/${region}`}
                  className="text-center text-sm py-2 border border-gray-200 rounded-full hover:bg-gray-50"
                >
                  {region}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">LoCo</h3>
              <p className="text-gray-500 text-sm mb-2">Location + Connect</p>
              <p className="text-gray-500 text-sm mb-4">공간을 연결하는 새로운 방법</p>
              <div className="flex space-x-4 text-gray-400 mb-4">
                <Link href="#" aria-label="Instagram">
                  <FaInstagram size={18} />
                </Link>
                <Link href="#" aria-label="Twitter">
                  <FaTwitter size={18} />
                </Link>
                <Link href="#" aria-label="YouTube">
                  <FaYoutube size={18} />
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-6">© 2025 LoCo Inc. All rights reserved.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-3">서비스 안내</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">공간 둘러하기</Link></li>
                <li><Link href="#" className="hover:text-gray-900">공간 찾기</Link></li>
                <li><Link href="#" className="hover:text-gray-900">예약 방법</Link></li>
                <li><Link href="#" className="hover:text-gray-900">자주 묻는 질문</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-3">회사 정보</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">회사 소개</Link></li>
                <li><Link href="#" className="hover:text-gray-900">이용약관</Link></li>
                <li><Link href="#" className="hover:text-gray-900">개인정보처리방침</Link></li>
                <li><Link href="#" className="hover:text-gray-900">채용정보</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-3">고객센터</h3>
              <p className="text-sm text-gray-600 mb-3">평일 10:00 - 18:00 (주말, 공휴일 제외)</p>
              <Link 
                href="#" 
                className="inline-block border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700 mb-4 hover:bg-gray-50"
              >
                1:1 문의하기
              </Link>
              <p className="text-sm text-gray-600">이메일: help@loco.com</p>
              <p className="text-sm text-gray-600">전화: 02-1234-5678</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}