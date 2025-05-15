"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users } from "lucide-react"
import { ThemeToggle } from "../components/ThemeToggle"

interface Space {
  id: number
  name: string
  location: string
  rating: number
  reviewCount: number
  capacity: number
  price: number
  imageUrl: string
  spaceType: string
}

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        // API 호출 대신 mockSpaces 사용
        setSpaces(mockSpaces)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching spaces:", error)
        setLoading(false)
      }
    }

    fetchSpaces()
  }, [])

  // 임시 데이터
  const mockSpaces = [
    {
      id: 1,
      name: "강남 프리미엄 회의실",
      location: "서울 강남구 테헤란로 123길 45",
      rating: 4.9,
      reviewCount: 128,
      capacity: 20,
      price: 20000,
      imageUrl: "/placeholder.svg?height=200&width=300",
      spaceType: "회의실",
    },
    {
      id: 2,
      name: "홍대 자연광 스튜디오",
      location: "서울 마포구 와우산로",
      rating: 4.7,
      reviewCount: 95,
      capacity: 15,
      price: 35000,
      imageUrl: "/placeholder.svg?height=200&width=300",
      spaceType: "스튜디오",
    },
    {
      id: 3,
      name: "이태원 푸르른 파티룸",
      location: "서울 용산구 이태원동",
      rating: 4.8,
      reviewCount: 112,
      capacity: 30,
      price: 50000,
      imageUrl: "/placeholder.svg?height=200&width=300",
      spaceType: "파티룸",
    },
    {
      id: 4,
      name: "연남동 북카페 세미나실",
      location: "서울 마포구 연남동",
      rating: 4.6,
      reviewCount: 87,
      capacity: 12,
      price: 15000,
      imageUrl: "/placeholder.svg?height=200&width=300",
      spaceType: "세미나실",
    },
    {
      id: 5,
      name: "역삼 비즈니스 미팅룸",
      location: "서울 강남구 역삼동",
      rating: 4.9,
      reviewCount: 156,
      capacity: 10,
      price: 40000,
      imageUrl: "/placeholder.svg?height=200&width=300",
      spaceType: "미팅룸",
    },
    {
      id: 6,
      name: "한남동 코워킹스페이스&카페",
      location: "서울 용산구 한남동",
      rating: 4.7,
      reviewCount: 103,
      capacity: 25,
      price: 30000,
      imageUrl: "/placeholder.svg?height=200&width=300",
      spaceType: "코워킹스페이스",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">서울의 인기 공간</h1>
        <p className="text-gray-600 mb-6">총 {mockSpaces.length}개의 공간이 있습니다.</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 필터 사이드바 */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-semibold mb-4">상세 필터</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">가격 범위</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">₩10,000</span>
                  <span className="text-xs text-gray-500">₩50,000</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="50000"
                  step="1000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">수용 인원</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">1 명</span>
                  <span className="text-xs text-gray-500">30명+</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-100">
                    1-5명
                  </button>
                  <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-100">
                    6-10명
                  </button>
                  <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-100">
                    11-20명
                  </button>
                  <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-100">
                    21명+
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">공간 유형</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">회의실</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">스튜디오</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">파티룸</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">카페</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">강의실</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">편의시설</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">와이파이</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">프로젝터</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">주차장</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">취사시설</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                    <span className="ml-2 text-sm">음향시설</span>
                  </label>
                </div>
              </div>

              <button className="w-full mt-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                필터 초기화
              </button>
            </div>
          </div>

          {/* 공간 목록 */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSpaces.map((space) => (
                <Link href={`/spaces/${space.id}`} key={space.id} className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="relative h-48">
                      <Image
                        src={space.imageUrl || "/placeholder.svg"}
                        alt={space.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {space.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{space.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{space.location}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Users size={14} className="mr-1" />
                        <span>최대 {space.capacity}명</span>
                        <span className="mx-2">•</span>
                        <span>{space.spaceType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-indigo-600 font-semibold">
                          ₩{space.price.toLocaleString()}
                          <span className="text-gray-500 font-normal">/시간</span>
                        </div>
                        <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md">예약하기</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-10">
              <nav className="flex items-center space-x-1">
                <button className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100">&lt;</button>
                <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">1</button>
                <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">2</button>
                <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">3</button>
                <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">4</button>
                <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">5</button>
                <button className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100">&gt;</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
