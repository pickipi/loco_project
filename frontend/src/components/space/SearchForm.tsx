"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    capacity: "",
    purpose: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    // Add non-empty parameters to the query
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    router.push(`/spaces/search?${queryParams.toString()}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EDE7D4] focus:border-transparent bg-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            name="location"
            placeholder="지역"
            value={searchParams.location}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="relative">
          <input
            type="date"
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="relative">
          <select
            name="capacity"
            value={searchParams.capacity}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">수용 인원</option>
            <option value="1-5">1-5명</option>
            <option value="6-10">6-10명</option>
            <option value="11-20">11-20명</option>
            <option value="20+">20명 이상</option>
          </select>
        </div>

        <div className="relative">
          <select
            name="purpose"
            value={searchParams.purpose}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">공간 용도</option>
            <option value="meeting">회의실</option>
            <option value="studio">스튜디오</option>
            <option value="party">파티룸</option>
            <option value="office">사무실</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="px-8 py-2 bg-[#40322F] text-white rounded-lg hover:bg-[#594a47] transition-colors duration-200"
        >
          공간 찾기
        </button>
      </div>
    </form>
  );
}
