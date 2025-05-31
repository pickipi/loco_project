"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SpaceFilter from "@/components/space/SpaceFilter";
import SpaceCard from "@/components/space/SpaceCard";
import MainHeader from "@/components/header/header";

interface SearchResult {
  id: string;
  spaceName: string;
  address: string;
  maxCapacity: number;
  price: number;
  spaceRating: number;
  imageId: number;
  isActive: boolean;
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";
        const response = await fetch(`${API_BASE_URL}/api/v1/spaces/all?page=0&size=12&sort=id`);
        if (!response.ok) {
          throw new Error("Failed to fetch spaces");
        }
        const data = await response.json();
        const spaceData = data.data?.content || [];
        setResults(spaceData);
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
          space.spaceName.toLowerCase().includes(query.toLowerCase()) ||
          space.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    // 지역 필터링
    if (location) {
      filtered = filtered.filter((space) =>
        space.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 수용 인원 필터링
    if (capacity) {
      const [min, max] = capacity.split("-");
      filtered = filtered.filter((space) => {
        if (max === "+") {
          return space.maxCapacity >= parseInt(min);
        }
        return space.maxCapacity >= parseInt(min) && space.maxCapacity <= parseInt(max);
      });
    }

    // 가격 필터링
    filtered = filtered.filter(
      (space) => space.price >= minPrice && space.price <= maxPrice
    );

    // 활성화된 공간만 필터링
    filtered = filtered.filter((space) => space.isActive);

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
                  <SpaceCard
                    key={space.id}
                    id={space.id}
                    title={space.spaceName}
                    location={space.address}
                    capacity={`${space.maxCapacity}명`}
                    price={space.price}
                    rating={Number(space.spaceRating) || 0}
                    imageUrl={space.imageId ? `/images/${space.imageId}` : "/placeholder.svg"}
                    reviewCount={0}
                    description=""
                    category="회의실"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
