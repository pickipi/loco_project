"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SpaceFilter from "@/components/space/SpaceFilter";
import SpaceCard from "@/components/space/SpaceCard";

interface SearchResult {
  id: string;
  title: string;
  location: string;
  capacity: string;
  price: number;
  rating: number;
  imageUrl: string;
}

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchResults = async () => {
      try {
        // Simulated API response
        const mockResults = [
          {
            id: "1",
            title: "강남 프리미엄 회의실",
            location: "서울 강남구",
            capacity: "20",
            price: 20000,
            rating: 4.5,
            imageUrl: "/sample-space-1.jpg",
          },
          {
            id: "2",
            title: "홍대 자연광 스튜디오",
            location: "서울 마포구",
            capacity: "15",
            price: 35000,
            rating: 4.7,
            imageUrl: "/sample-space-2.jpg",
          },
          {
            id: "3",
            title: "이태원 푸르른 파티룸",
            location: "서울 용산구",
            capacity: "30",
            price: 50000,
            rating: 4.8,
            imageUrl: "/sample-space-3.jpg",
          },
        ];

        setResults(mockResults);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const location = searchParams.get("location") || "전체";
  const date = searchParams.get("date");
  const capacity = searchParams.get("capacity");
  const purpose = searchParams.get("purpose");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={50}
              priority
              className="object-contain"
            />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* 필터 사이드바 */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <SpaceFilter />
          </aside>

          <main className="flex-1">
            {/* 검색 결과 헤더 */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">검색 결과</h1>
              <div className="mt-2 space-y-1">
                {location && <p className="text-gray-600">지역: {location}</p>}
                {date && <p className="text-gray-600">날짜: {date}</p>}
                {capacity && <p className="text-gray-600">인원: {capacity}</p>}
                {purpose && <p className="text-gray-600">용도: {purpose}</p>}
              </div>
            </div>

            {/* 검색 결과 목록 */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((space) => (
                  <SpaceCard key={space.id} {...space} />
                ))}
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  검색 결과가 없습니다
                </h3>
                <p className="mt-2 text-gray-500">
                  다른 검색 조건을 시도해보세요
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
