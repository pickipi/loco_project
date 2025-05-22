"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SpaceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState("50000");
  const [filters, setFilters] = useState({
    spaceTypes: new Set<string>(),
    amenities: new Set<string>(),
    capacity: "",
  });

  const updateFilters = (
    category: "spaceTypes" | "amenities",
    value: string
  ) => {
    setFilters((prev) => {
      const newSet = new Set(prev[category]);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return {
        ...prev,
        [category]: newSet,
      };
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update price range
    params.set("maxPrice", priceRange);

    // Update space types
    if (filters.spaceTypes.size > 0) {
      params.set("types", Array.from(filters.spaceTypes).join(","));
    } else {
      params.delete("types");
    }

    // Update amenities
    if (filters.amenities.size > 0) {
      params.set("amenities", Array.from(filters.amenities).join(","));
    } else {
      params.delete("amenities");
    }

    // Update capacity
    if (filters.capacity) {
      params.set("capacity", filters.capacity);
    } else {
      params.delete("capacity");
    }

    router.push(`/spaces/search?${params.toString()}`);
  };

  const resetFilters = () => {
    setPriceRange("50000");
    setFilters({
      spaceTypes: new Set(),
      amenities: new Set(),
      capacity: "",
    });
    router.push("/spaces/search");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-4">상세 필터</h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">가격 범위</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">₩10,000</span>
          <span className="text-xs text-gray-500">
            ₩{parseInt(priceRange).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="100000"
          step="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">수용 인원</h3>
        <div className="flex gap-2 flex-wrap">
          {["1-5명", "6-10명", "11-20명", "21명+"].map((range) => (
            <button
              key={range}
              onClick={() =>
                setFilters((prev) => ({ ...prev, capacity: range }))
              }
              className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                filters.capacity === range
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">공간 유형</h3>
        <div className="space-y-2">
          {[
            ["meeting", "회의실"],
            ["studio", "스튜디오"],
            ["party", "파티룸"],
            ["cafe", "카페"],
            ["lecture", "강의실"],
          ].map(([value, label]) => (
            <label key={value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.spaceTypes.has(value)}
                onChange={() => updateFilters("spaceTypes", value)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">편의시설</h3>
        <div className="space-y-2">
          {[
            ["wifi", "와이파이"],
            ["projector", "프로젝터"],
            ["parking", "주차장"],
            ["kitchen", "취사시설"],
            ["sound", "음향시설"],
          ].map(([value, label]) => (
            <label key={value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.has(value)}
                onChange={() => updateFilters("amenities", value)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 py-2 bg-[#40322F] text-white rounded-md hover:bg-[#594a47] transition"
        >
          필터 적용
        </button>
        <button
          onClick={resetFilters}
          className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
