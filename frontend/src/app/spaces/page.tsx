"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/space/SearchForm";
import SpaceCard from "@/components/space/SpaceCard";

interface FeaturedSpace {
  id: string;
  title: string;
  location: string;
  capacity: string;
  price: number;
  rating: number;
  imageUrl: string;
}

export default function SpacesPage() {
  const [loading, setLoading] = useState(false);
  const featuredSpaces: FeaturedSpace[] = [
    {
      id: "1",
      title: "모던한 회의실",
      location: "서울 강남구",
      capacity: "10",
      price: 20000,
      rating: 4.5,
      imageUrl: "/sample-space-1.jpg",
    },
    {
      id: "2",
      title: "스튜디오",
      location: "서울 마포구",
      capacity: "15",
      price: 35000,
      rating: 4.7,
      imageUrl: "/sample-space-2.jpg",
    },
    {
      id: "3",
      title: "파티룸",
      location: "서울 용산구",
      capacity: "20",
      price: 45000,
      rating: 4.8,
      imageUrl: "/sample-space-3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <div className="relative py-16 bg-[#40322F]">
        <div className="absolute top-8 left-8 z-10">
          <Link href="/">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              당신에게 딱 맞는 공간을 찾아보세요
            </h1>
            <p className="text-xl text-gray-200">
              회의실, 스튜디오, 파티룸 등 다양한 공간을 간편하게 예약하세요
            </p>
          </div>

          <SearchForm />
        </div>
      </div>

      {/* Featured Spaces Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">추천 공간</h2>
          <Link
            href="/spaces/search"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} {...space} />
          ))}
        </div>
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
    </div>
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
