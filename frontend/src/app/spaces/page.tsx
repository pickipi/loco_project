'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/space/SearchForm";
import SpaceCard from "@/components/space/SpaceCard";
import Header from "@/components/header/header";
import api from "@/lib/axios";

interface Space {
  id: number;
  spaceName: string;
  address: string;
  price: number;
  imageUrl: string;
  maxCapacity: number;
}

interface PageResponse {
  content: Space[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export default function SpaceListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);
        const res = await api.get<PageResponse>('/spaces/all', {
          params: {
            page: currentPage,
            size: pageSize,
            sort: 'id,desc'
          }
        });
        
        const page = res.data;
        setSpaces(page.content);
        setTotalPages(page.totalPages);
        setCurrentPage(page.number);
      } catch (err) {
        console.error('공간 목록 조회 실패:', err);
        setError('공간 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/spaces/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const filteredSpaces = selectedCategory
    ? spaces.filter(space =>
        space.spaceName.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : spaces;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

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

      {/* Space Categories */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">공간 유형</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard
              title="회의실"
              description="프로페셔널한 미팅을 위한 공간"
              icon="🏢"
              onClick={() => handleCategoryClick("회의실")}
              isSelected={selectedCategory === "회의실"}
            />
            <CategoryCard
              title="스튜디오"
              description="촬영과 작업을 위한 공간"
              icon="📸"
              onClick={() => handleCategoryClick("스튜디오")}
              isSelected={selectedCategory === "스튜디오"}
            />
            <CategoryCard
              title="파티룸"
              description="특별한 모임을 위한 공간"
              icon="🎉"
              onClick={() => handleCategoryClick("파티룸")}
              isSelected={selectedCategory === "파티룸"}
            />
            <CategoryCard
              title="카페"
              description="편안한 미팅을 위한 공간"
              icon="☕"
              onClick={() => handleCategoryClick("카페")}
              isSelected={selectedCategory === "카페"}
            />
          </div>
        </div>
      </div>

      {/* Spaces List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory} 공간` : "모든 공간"}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[#40322F] hover:text-[#594a47] font-medium"
            >
              전체 보기
            </button>
          )}
        </div>

        {filteredSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                id={space.id.toString()}
                title={space.spaceName}
                location={space.address}
                capacity={space.maxCapacity.toString()}
                price={space.price}
                rating={0}
                imageUrl={space.imageUrl}
                description=""
                category=""
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">등록된 공간이 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  isSelected: boolean;
}

function CategoryCard({ title, description, icon, onClick, isSelected }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border ${
        isSelected ? "border-[#40322F] bg-[#F5F5F5]" : "border-gray-200"
      }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}