"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SpaceFilter from "@/components/space/SpaceFilter";
import SpaceCard from "@/components/space/SpaceCard";
import MainHeader from "@/components/header/MainHeader";
import { SpaceListResponseDto } from "@/types/space";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [allSpaces, setAllSpaces] = useState<SpaceListResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredSpaces, setFilteredSpaces] = useState<SpaceListResponseDto[]>([]);

  const location = searchParams.get("location");
  const purpose = searchParams.get("purpose");
  const capacity = searchParams.get("capacity");
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "1000000");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/spaces/all`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('검색 페이지 공간 데이터 가져오기 성공:', data);

        if (data.resultCode === 'S-1' && data.data && data.data.content) {
          setAllSpaces(data.data.content);
        } else {
          console.error('검색 페이지 데이터 구조가 예상과 다릅니다:', data);
          setAllSpaces([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    let filtered = [...allSpaces];

    if (query) {
      filtered = filtered.filter(
        (space) =>
          space.spaceName.toLowerCase().includes(query.toLowerCase()) ||
          space.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((space) =>
        space.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (purpose) {
      filtered = filtered.filter((space) => space.spaceType === purpose);
    }

    if (capacity) {
      const [min, max] = capacity.split("-");
      filtered = filtered.filter((space) => {
        const spaceCapacity = space.maxCapacity;
        if (max === "+") {
          return spaceCapacity >= parseInt(min);
        }
        return spaceCapacity >= parseInt(min) && spaceCapacity <= parseInt(max);
      });
    }

    filtered = filtered.filter(
      (space) => space.price >= minPrice && space.price <= maxPrice
    );

    setFilteredSpaces(filtered.filter(space => space.isActive));
  }, [query, location, purpose, capacity, minPrice, maxPrice, allSpaces]);

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <SpaceFilter />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                검색 결과: {filteredSpaces.length}개의 공간
              </h1>
              {query && (
                <p className="text-gray-600 mt-2">'{query}' 검색 결과입니다.</p>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p>검색 중...</p>
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
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
