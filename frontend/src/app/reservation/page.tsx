"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/Calendar";
import TimeSelector from "@/components/TimeSelector";
import SpaceList from "@/components/SpaceList";

interface ReservationState {
  selectedDate: Date | null;
  selectedTime: string;
  selectedSpace: string;
}

export default function ReservationPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");

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
    </div>
  );
}
