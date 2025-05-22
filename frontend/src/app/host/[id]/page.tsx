"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Star } from "lucide-react"
import { ThemeToggle } from "../../components/ThemeToggle"
import { use } from "react"

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

export default function HostSpacesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [hostData, setHostData] = useState<any>(null)
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 구현에서는 호스트 ID를 기반으로 API 호출
    const fetchHostData = async () => {
      try {
        // const response = await fetch(`/api/v1/hosts/${resolvedParams.id}`)
        // const data = await response.json()
        // setHostData(data)

        // 임시 데이터
        setHostData({
          id: resolvedParams.id,
          name: "김호스트",
          profileImage: "/placeholder.svg?height=100&width=100",
          description:
            "안녕하세요! 서울 강남에서 다양한 공간을 운영하고 있습니다. 깨끗하고 편안한 공간을 제공하기 위해 항상 노력하고 있습니다.",
          rating: 4.8,
          reviewCount: 156,
          spaceCount: 5,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching host data:", error)
        setLoading(false)
      }
    }

    const fetchHostSpaces = async () => {
      try {
        // 실제 API 호출
        // const response = await fetch(`/api/v1/hosts/${resolvedParams.id}/spaces`)
        // const data = await response.json()
        // setSpaces(data)

        // 임시 데이터
        setSpaces([
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
            name: "역삼 비즈니스 센터",
            location: "서울 강남구 역삼동",
            rating: 4.7,
            reviewCount: 95,
            capacity: 15,
            price: 35000,
            imageUrl: "/placeholder.svg?height=200&width=300",
            spaceType: "회의실",
          },
          {
            id: 3,
            name: "삼성동 코워킹스페이스",
            location: "서울 강남구 삼성동",
            rating: 4.8,
            reviewCount: 112,
            capacity: 30,
            price: 25000,
            imageUrl: "/placeholder.svg?height=200&width=300",
            spaceType: "코워킹스페이스",
          },
          {
            id: 4,
            name: "청담 프라이빗 스튜디오",
            location: "서울 강남구 청담동",
            rating: 4.6,
            reviewCount: 87,
            capacity: 12,
            price: 45000,
            imageUrl: "/placeholder.svg?height=200&width=300",
            spaceType: "스튜디오",
          },
          {
            id: 5,
            name: "논현 세미나실",
            location: "서울 강남구 논현동",
            rating: 4.5,
            reviewCount: 76,
            capacity: 25,
            price: 30000,
            imageUrl: "/placeholder.svg?height=200&width=300",
            spaceType: "세미나실",
          },
        ])
      } catch (error) {
        console.error("Error fetching host spaces:", error)
      }
    }

    fetchHostData()
    fetchHostSpaces()
  }, [resolvedParams.id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!hostData) {
    return <div className="flex justify-center items-center min-h-screen">호스트 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        {/* 호스트 프로필 */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={hostData.profileImage || "/placeholder.svg"}
                alt={hostData.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{hostData.name}님의 공간</h1>
              <div className="flex items-center mb-3">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium text-gray-900 dark:text-white">{hostData.rating}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">({hostData.reviewCount}개 리뷰)</span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                <span className="text-gray-600 dark:text-gray-400">공간 {hostData.spaceCount}개</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{hostData.description}</p>
            </div>
          </div>
        </div>

        {/* 호스트의 공간 목록 */}
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{hostData.name}님의 공간 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space: Space) => (
            <Link href={`/spaces/${space.id}`} key={space.id} className="block">
              <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="relative h-48">
                  <Image src={space.imageUrl || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-medium flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-900 dark:text-white">{space.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 text-gray-900 dark:text-white">{space.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{space.location}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Users size={14} className="mr-1" />
                    <span>최대 {space.capacity}명</span>
                    <span className="mx-2">•</span>
                    <span>{space.spaceType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      ₩{space.price.toLocaleString()}
                      <span className="text-gray-500 dark:text-gray-400 font-normal">/시간</span>
                    </div>
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1 rounded-md">예약하기</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
