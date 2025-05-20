"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Star, Share2, Heart, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeToggle } from "../../components/ThemeToggle"

export default function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [space, setSpace] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpaceDetail = async () => {
      try {
        // 실제 API 호출
        // const response = await fetch(`/api/v1/spaces/${id}`)
        // const data = await response.json()
        // setSpace(data)

        // 임시 데이터
        setSpace({
          id: id,
          name: "강남 프리미엄 회의실",
          location: "서울 강남구 테헤란로 123길 45",
          detailLocation: "서울 강남구 테헤란로 123길 45, 7층 702호",
          subLocation: "지하철 2호선 강남역 4번 출구 도보 5분",
          busLocation: "버스: 강남역 버스정류장 도보 5분",
          description:
            "깔끔하고 모던한 분위기의 프리미엄 회의실입니다. 자연광이 풍부하게 들어와 쾌적한 환경에서 업무를 진행하실 수 있습니다. 최신식 빔프로젝터와 화이트보드를 구비하고 있어 회의나 세미나에 적합합니다.",
          rating: 4.9,
          reviewCount: 128,
          capacity: 20,
          price: 20000,
          spaceType: "회의실",
          host: {
            id: "1",
            name: "김호스트",
            profileImage: "/placeholder.svg?height=50&width=50",
          },
          amenities: [
            { icon: "wifi", name: "와이파이" },
            { icon: "projector", name: "프로젝터" },
            { icon: "whiteboard", name: "화이트보드" },
            { icon: "aircon", name: "냉난방기" },
            { icon: "parking", name: "주차장" },
          ],
          images: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
          ],
          availableTimes: [
            { time: "09:00", price: 20000, available: true },
            { time: "10:00", price: 20000, available: true },
            { time: "11:00", price: 20000, available: true },
            { time: "12:00", price: 20000, available: false },
            { time: "13:00", price: 20000, available: true },
            { time: "14:00", price: 20000, available: true },
            { time: "15:00", price: 20000, available: true },
            { time: "16:00", price: 20000, available: true },
          ],
          rules: [
            "예약 시간 준수를 부탁드립니다.",
            "음식물 반입 시 사전 문의 바랍니다.",
            "시설물 훼손 시 배상책임이 있습니다.",
            "주차는 2시간 무료이며, 추가 시간은 30분당 2,000원입니다.",
            "퇴실 시 정리를 부탁드립니다.",
          ],
          reviews: [
            {
              id: 1,
              user: "김서연",
              rating: 5,
              date: "2023.05.31",
              content:
                "깔끔하고 쾌적한 환경에서 미팅을 진행할 수 있었습니다. 특히 프로젝터와 화이트보드 상태가 좋아서 만족했습니다. 다음에도 이용하고 싶습니다.",
            },
            {
              id: 2,
              user: "이준호",
              rating: 4,
              date: "2023.04.28",
              content:
                "위치도 좋고 시설도 좋았어요. 다만 냉방시설이 조금 약해서 오후에는 더웠습니다. 그래도 전체적으로 만족스러운 공간이었습니다.",
            },
          ],
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching space details:", error)
        setLoading(false)
      }
    }

    fetchSpaceDetail()
  }, [id])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleReservation = () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요.")
      return
    }

    // 예약 처리 로직
    alert(`${selectedDate.toLocaleDateString()} ${selectedTime}에 예약이 완료되었습니다.`)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
  }

  if (!space) {
    return <div className="flex justify-center items-center min-h-screen">공간 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 컨텐츠 영역 */}
          <div className="w-full lg:w-2/3">
            {/* 공간 기본 정보 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{space.name}</h1>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin size={16} className="mr-1" />
                <span>{space.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{space.rating}</span>
                  <span className="text-gray-500 ml-1">({space.reviewCount})</span>
                </div>
                <div className="flex items-center mr-4">
                  <Users size={16} className="mr-1" />
                  <span>최대 {space.capacity}명</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>09:00 - 22:00</span>
                </div>
              </div>
              <p className="text-gray-700">{space.description}</p>
            </div>

            {/* 공간 특징 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">공간 특징</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {space.amenities.map((amenity: any, index: number) => (
                  <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <Image src={`/placeholder.svg?height=24&width=24`} alt={amenity.name} width={24} height={24} />
                    </div>
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">위치</h2>
              <div className="bg-gray-100 h-[300px] rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">지도가 표시됩니다</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">{space.detailLocation}</p>
                <p className="text-gray-600 text-sm">{space.subLocation}</p>
                <p className="text-gray-600 text-sm">{space.busLocation}</p>
              </div>
            </div>

            {/* 이용 규칙 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">이용 규칙</h2>
              <ul className="space-y-2">
                {space.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 리뷰 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">후기 {space.reviewCount}개</h2>
                <Link href="#" className="text-indigo-600 text-sm">
                  더보기 &gt;
                </Link>
              </div>
              <div className="space-y-6">
                {space.reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="font-medium">{review.user}</div>
                      <div className="mx-2 text-gray-300">|</div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <div className="ml-auto text-sm text-gray-500">{review.date}</div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 예약 영역 */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <div className="mb-4">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  ₩{space.price.toLocaleString()}
                  <span className="text-gray-500 text-base font-normal">/시간</span>
                </div>
              </div>

              {/* 날짜 선택 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜 선택</label>
                <button className="w-full flex items-center justify-between px-4 py-2 border rounded-md">
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    <span>{selectedDate ? selectedDate.toLocaleDateString() : "날짜를 선택하세요"}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>
              </div>

              {/* 시간 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">시간 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {space.availableTimes.map((timeSlot: any) => (
                    <button
                      key={timeSlot.time}
                      onClick={() => timeSlot.available && handleTimeSelect(timeSlot.time)}
                      disabled={!timeSlot.available}
                      className={`px-3 py-2 rounded-md text-center ${
                        selectedTime === timeSlot.time
                          ? "bg-indigo-600 text-white"
                          : timeSlot.available
                            ? "border hover:bg-gray-50"
                            : "border bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {timeSlot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* 예약 버튼 */}
              <button
                onClick={handleReservation}
                className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                예약하기
              </button>

              {/* 호스트 정보 */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={space.host.profileImage || "/placeholder.svg"}
                      alt={space.host.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{space.host.name}</div>
                    <Link href={`/host/${space.host.id}`} className="text-sm text-indigo-600">
                      호스트 프로필 보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
