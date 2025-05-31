"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SpaceFilter from "@/components/space/SpaceFilter";
import SpaceCard from "@/components/space/SpaceCard";
import MainHeader from "@/components/MainHeader";

interface SearchResult {
  id: string;
  title: string;
  location: string;
  capacity: string;
  price: number;
  rating: number;
  imageUrl: string;
  purpose?: string;
  description: string;
  category: string;
}

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

  const location = searchParams.get("location");
  const purpose = searchParams.get("purpose");
  const capacity = searchParams.get("capacity");
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "1000000");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // TODO: Replace with actual API call
        const mockResults = [
          {
            id: "1",
            title: "모던한 회의실",
            location: "서울 강남구",
            capacity: "10",
            price: 20000,
            rating: 4.5,
            imageUrl: "/sample-space-1.jpg",
            purpose: "meeting",
            description: "모던한 인테리어의 회의실",
            category: "회의실"
          },
          {
            id: "2",
            title: "스튜디오",
            location: "서울 마포구",
            capacity: "15",
            price: 35000,
            rating: 4.7,
            imageUrl: "/sample-space-2.jpg",
            purpose: "studio",
            description: "다양한 용도로 사용 가능한 스튜디오",
            category: "스튜디오"
          },
          {
            id: "3",
            title: "파티룸",
            location: "서울 용산구",
            capacity: "20",
            price: 45000,
            rating: 4.8,
            imageUrl: "/sample-space-3.jpg",
            purpose: "party",
            description: "넓은 공간의 파티룸",
            category: "파티룸"
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
  }, []);

  // 검색어와 필터를 적용하는 로직
  useEffect(() => {
    let filtered = [...results];

    // 검색어로 필터링
    if (query) {
      filtered = filtered.filter(
        (space) =>
          space.title.toLowerCase().includes(query.toLowerCase()) ||
          space.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // 지역 필터링
    if (location) {
      filtered = filtered.filter((space) =>
        space.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 용도 필터링
    if (purpose) {
      filtered = filtered.filter((space) => space.purpose === purpose);
    }

    // 수용 인원 필터링
    if (capacity) {
      const [min, max] = capacity.split("-");
      filtered = filtered.filter((space) => {
        const spaceCapacity = parseInt(space.capacity);
        if (max === "+") {
          return spaceCapacity >= parseInt(min);
        }
        return spaceCapacity >= parseInt(min) && spaceCapacity <= parseInt(max);
      });
    }

    // 가격 필터링
    filtered = filtered.filter(
      (space) => space.price >= minPrice && space.price <= maxPrice
    );

    setFilteredResults(filtered);
  }, [query, location, purpose, capacity, minPrice, maxPrice, results]);

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 필터 사이드바 */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <SpaceFilter />
          </aside>

          {/* 검색 결과 */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                검색 결과: {filteredResults.length}개의 공간
              </h1>
              {query && (
                <p className="text-gray-600 mt-2">'{query}' 검색 결과입니다.</p>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p>검색 중...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((space) => (
                  <SpaceCard key={space.id} {...space} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
