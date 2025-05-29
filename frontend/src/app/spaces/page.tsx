"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/space/SearchForm";
import SpaceCard from "@/components/space/SpaceCard";
import MainHeader from "@/components/header/MainHeader";
import { SpaceListResponseDto } from "@/types/space";
import { toast } from 'react-toastify';

//로컬 url 머지하면서 추가
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

// FeaturedSpace 인터페이스는 더 이상 필요하지 않습니다. SpaceListResponseDto 사용
/*
interface FeaturedSpace {
  id: string;
  title: string;
  location: string;
  capacity: string;
  price: number;
  rating: number;
  imageUrl: string;
}
*/

export default function SpacesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 추가
  const [spaces, setSpaces] = useState<SpaceListResponseDto[]>([]); // 공간 데이터 상태 추가

  // 백엔드에서 공간 목록을 가져오는 함수
  const fetchSpaces = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // /api/v1/spaces/all 엔드포인트는 permitAll() 설정이므로 인증 헤더가 필요 없습니다.
      const response = await fetch(`${API_BASE_URL}/api/v1/spaces/all`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('공간 데이터 가져오기 성공:', data);

      // 백엔드 응답 구조에 맞게 데이터 설정
      // RsData 객체 안에 실제 데이터가 있을 것으로 가정
      if (data.resultCode === 'S-1' && data.data && data.data.content) {
          setSpaces(data.data.content);
      } else {
          console.error('데이터 구조가 예상과 다릅니다:', data);
          setSpaces([]); // 비어있는 배열로 설정
      }

    } catch (error) {
      console.error('공간 데이터 가져오기 오류:', error);
      toast.error('공간 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <main className="min-h-screen bg-white">
      <MainHeader
        onSearch={(query) => {
          if (query.trim()) {
            router.push(`/spaces/search?query=${encodeURIComponent(query)}`);
          }
        }}
      />

      {/* Hero Section */}
      <div className="bg-[#40322F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            당신에게 딱 맞는 공간을 찾아보세요
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            회의실, 스튜디오, 파티룸 등 다양한 공간을 간편하게 예약하세요
          </p>
          <SearchForm />
        </div>
      </div>

      {/* Featured Spaces Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">추천 공간</h2>{" "}
          <Link
            href="/spaces/all"
            className="text-[#40322F] hover:text-[#594a47] font-medium flex items-center"
          >
            모든 공간 보기
            <svg
              className="w-5 h-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <p>공간 목록을 불러오는 중...</p>
        ) : (
          spaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <SpaceCard key={space.id} {...space} />
              ))}
            </div>
          ) : (
            <p>등록된 공간이 없습니다.</p>
          )
        )}
      </div>

      {/* Space Categories */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">공간 유형</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard
              title="회의실"
              description="프로페셔널한 미팅을 위한 공간"
              icon="🏢"
            />
            <CategoryCard
              title="스튜디오"
              description="촬영과 작업을 위한 공간"
              icon="📸"
            />
            <CategoryCard
              title="파티룸"
              description="특별한 모임을 위한 공간"
              icon="🎉"
            />
            <CategoryCard
              title="카페"
              description="편안한 미팅을 위한 공간"
              icon="☕"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
}

function CategoryCard({ title, description, icon }: CategoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
