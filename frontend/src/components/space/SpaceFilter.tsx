"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Filters {
  location: string;
  purpose: string;
  capacity: string;
  minPrice: string;
  maxPrice: string;
}

export default function SpaceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get("location") || "",
    purpose: searchParams.get("purpose") || "",
    capacity: searchParams.get("capacity") || "",
    minPrice: searchParams.get("minPrice") || "10000",
    maxPrice: searchParams.get("maxPrice") || "100000",
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    // 기존 검색어 유지
    if (searchQuery) {
      params.set("query", searchQuery);
    }

    // 필터 값 설정
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/spaces/search?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      purpose: "",
      capacity: "",
      minPrice: "10000",
      maxPrice: "100000",
    });

    // 검색어만 유지
    if (searchQuery) {
      router.push(`/spaces/search?query=${searchQuery}`);
    } else {
      router.push("/spaces/search");
    }
  };

  useEffect(() => {
    // URL 파라미터가 변경될 때 필터 상태 업데이트
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get("location") || prev.location,
      purpose: searchParams.get("purpose") || prev.purpose,
      capacity: searchParams.get("capacity") || prev.capacity,
      minPrice: searchParams.get("minPrice") || prev.minPrice,
      maxPrice: searchParams.get("maxPrice") || prev.maxPrice,
    }));
  }, [searchParams]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-4">상세 필터</h2>

      {/* 지역 필터 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">지역</h3>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EDE7D4] focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="강남구">강남구</option>
          <option value="마포구">마포구</option>
          <option value="용산구">용산구</option>
        </select>
      </div>

      {/* 공간 용도 필터 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">공간 용도</h3>
        <select
          value={filters.purpose}
          onChange={(e) => handleFilterChange("purpose", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EDE7D4] focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="meeting">회의실</option>
          <option value="studio">스튜디오</option>
          <option value="party">파티룸</option>
          <option value="office">사무실</option>
        </select>
      </div>

      {/* 수용 인원 필터 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">수용 인원</h3>
        <select
          value={filters.capacity}
          onChange={(e) => handleFilterChange("capacity", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EDE7D4] focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="1-5">1-5명</option>
          <option value="6-10">6-10명</option>
          <option value="11-20">11-20명</option>
          <option value="20+">20명 이상</option>
        </select>
      </div>

      {/* 가격 범위 필터 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">시간당 가격</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            ₩{parseInt(filters.minPrice).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">
            ₩{parseInt(filters.maxPrice).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="range"
            min="10000"
            max="50000"
            step="5000"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="50000"
            max="100000"
            step="5000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 필터 적용/초기화 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 py-2 bg-[#40322F] text-white rounded-lg hover:bg-[#594a47] transition-colors"
        >
          필터 적용
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
