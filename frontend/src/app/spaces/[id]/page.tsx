// app/spaces/[id]/page.tsx

"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar as CalendarIcon,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useRouter } from "next/navigation";
import Calendar from "@/components/Calendar";
import Header from "@/components/header/header";

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSpaceDetail = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";
        const response = await fetch(`${API_BASE_URL}/api/v1/spaces/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("로그인이 필요합니다.");
            router.push("/login");
          } else {
            throw new Error(
              `Failed to fetch space details: ${response.status}`
            );
          }
        }

        const data = await response.json();
        const spaceData = data.data;

        if (!spaceData) {
          throw new Error("No space data received");
        }

        // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
        setSpace({
          id: spaceData.id,
          name: spaceData.spaceName || "",
          location: spaceData.address || "",
          detailLocation: spaceData.detailAddress || spaceData.address || "",
          subLocation: spaceData.neighborhoodInfo || "",
          description: spaceData.description || "",
          rating: Number(spaceData.spaceRating) || 0,
          reviewCount: 0,
          capacity: spaceData.maxCapacity || 0,
          price: spaceData.price || 0,
          spaceType: "회의실",
          host: {
            id: spaceData.hostId || "1",
            name: spaceData.hostName || "호스트",
            profileImage:
              spaceData.hostProfileImage || "/images/placeholder.png",
          },
          imageUrl: spaceData.imageUrl
            ? spaceData.imageUrl.startsWith("http")
              ? spaceData.imageUrl
              : `https://loco-project-s3-image.s3.ap-northeast-2.amazonaws.com/${spaceData.imageUrl}`
            : "/images/placeholder.png",
          imageId: spaceData.imageId || null,
          additionalImageUrls: Array.isArray(spaceData.imageUrls)
            ? spaceData.imageUrls
            : [],
          amenities: [
            { icon: "wifi", name: "와이파이" },
            { icon: "projector", name: "프로젝터" },
            { icon: "whiteboard", name: "화이트보드" },
            { icon: "aircon", name: "냉난방기" },
            { icon: "parking", name: "주차장" },
          ],
          availableTimes: [
            { time: "09:00", price: spaceData.price || 0, available: true },
            { time: "10:00", price: spaceData.price || 0, available: true },
            { time: "11:00", price: spaceData.price || 0, available: true },
            { time: "12:00", price: spaceData.price || 0, available: false },
            { time: "13:00", price: spaceData.price || 0, available: true },
            { time: "14:00", price: spaceData.price || 0, available: true },
            { time: "15:00", price: spaceData.price || 0, available: true },
            { time: "16:00", price: spaceData.price || 0, available: true },
          ],
          rules: [
            "예약 시간 준수를 부탁드립니다.",
            "음식물 반입 시 사전 문의 바랍니다.",
            "시설물 훼손 시 배상책임이 있습니다.",
            "주차는 2시간 무료이며, 추가 시간은 30분당 2,000원입니다.",
            "퇴실 시 정리를 부탁드립니다.",
          ],
          reviews: [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching space details:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch space details"
        );
        setLoading(false);
      }
    };

    fetchSpaceDetail();
  }, [id, router]);

  // 날짜/시간 선택 핸들러들...
  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  const handleReservation = () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }
    // 예약 페이지로 이동하며 선택된 날짜와 시간, 공간 ID를 쿼리 파라미터로 전달
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    router.push(`/reservation?spaceId=${space.id}&date=${formattedDate}&time=${selectedTime}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        공간 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
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
                  <span className="text-gray-500 ml-1">
                    ({space.reviewCount})
                  </span>
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

              {/* 이미지 섹션 추가 */}
              <div className="mb-4">
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={space.imageUrl}
                    alt={space.name}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>

                {space.additionalImageUrls &&
                  space.additionalImageUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {space.additionalImageUrls.map(
                        (imgKey: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative h-24 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={
                                imgKey.startsWith("http")
                                  ? imgKey
                                  : `https://loco-project-s3-image.s3.ap-northeast-2.amazonaws.com/${imgKey}`
                              }
                              alt={`${space.name} 이미지 ${idx + 2}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>

              <p className="text-gray-700">{space.description}</p>
            </div>

            {/* 공간 특징(어메니티) 부분 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">공간 특징</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {space.amenities.map((amenity: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <Image
                        src={`/placeholder.svg?height=24&width=24`}
                        alt={amenity.name}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 위치 정보, 이용 규칙, 리뷰 등 생략(기존 코드 재사용) */}
            {/* ... */}
          </div>

          {/* 오른쪽 예약 영역 */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <div className="mb-4">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  ₩{space.price.toLocaleString()}
                  <span className="text-gray-500 text-base font-normal">
                    /시간
                  </span>
                </div>
              </div>

              {/* 날짜 선택 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜 선택
                </label>
                <button 
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center justify-between px-4 py-2 border rounded-md"
                >
                  <div className="flex items-center">
                    <CalendarIcon size={18} className="mr-2 text-gray-500" />
                    <span>
                      {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "날짜를 선택하세요"}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>
              </div>

              {/* 캘린더 표시 영역 */}
              {showCalendar && (
                <div className="mb-4">
                  <Calendar 
                    selectedDate={selectedDate}
                    onChange={handleDateSelect}
                  />
                </div>
              )}

              {/* 시간 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {space.availableTimes.map((timeSlot: any) => (
                    <button
                      key={timeSlot.time}
                      onClick={() =>
                        timeSlot.available && handleTimeSelect(timeSlot.time)
                      }
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={
                          space.host.profileImage || "/images/placeholder.png"
                        }
                        alt={space.host.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{space.host.name}</div>
                      <Link
                        href={`/host/${space.host.id}`}
                        className="text-sm text-indigo-600"
                      >
                        호스트 프로필 보기
                      </Link>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/host/chat?hostId=${space.host.id}&spaceId=${space.id}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                  >
                    호스트와 채팅하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
