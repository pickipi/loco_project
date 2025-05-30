"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/Calendar";
import TimeSelector from "@/components/TimeSelector";
import SpaceList from "@/components/SpaceList";
import { format } from "date-fns";

interface ReservationState {
  selectedDate: Date | null;
  selectedTime: string;
  selectedSpace: string;
}

interface Reservation {
  id: number;
  spaceName: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

export default function ReservationPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/v1/space-reservations/guest/1"); // TODO: 실제 사용자 ID로 변경
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("예약 목록을 불러오는데 실패했습니다:", error);
    }
  };

  const handleStatusChange = async (
    reservationId: number,
    newStatus: string
  ) => {
    try {
      await fetch(
        `/api/v1/space-reservations/${reservationId}/status?status=${newStatus}`,
        {
          method: "PATCH",
        }
      );
      fetchReservations(); // 목록 새로고침
    } catch (error) {
      console.error("예약 상태 변경에 실패했습니다:", error);
    }
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime || !selectedSpace) {
      alert("모든 필드를 선택해주세요.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    router.push(
      `/payment?space=${selectedSpace}&date=${formattedDate}&time=${selectedTime}`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">공간 예약</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 공간 선택 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">공간 선택</h2>
          <SpaceList
            selectedSpace={selectedSpace}
            onSelect={setSelectedSpace}
          />
        </div>

        {/* 날짜/시간 선택 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">날짜 및 시간 선택</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">날짜 선택</h3>
              <Calendar
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">시간 선택</h3>
              <TimeSelector
                selectedTime={selectedTime}
                onChange={setSelectedTime}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleReservation}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          예약하기
        </button>
      </div>

      
      <div className="mt-8 text-2xl font-bold mb-6">내 예약 목록</div>
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  {reservation.spaceName}
                </h2>
                <p className="text-gray-600">
                  {format(
                    new Date(reservation.startTime),
                    "yyyy년 MM월 dd일 HH:mm"
                  )}{" "}
                  ~ {format(new Date(reservation.endTime), "HH:mm")}
                </p>
                <p className="text-sm text-gray-500">
                  예약일시:{" "}
                  {format(
                    new Date(reservation.createdAt),
                    "yyyy년 MM월 dd일 HH:mm"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    reservation.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {reservation.status === "CONFIRMED"
                    ? "확정"
                    : reservation.status === "PENDING"
                    ? "대기중"
                    : "거절"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
