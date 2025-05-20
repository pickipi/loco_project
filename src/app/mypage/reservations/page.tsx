"use client";

import { useState, useEffect } from "react";

interface Reservation {
  id: string;
  spaceName: string;
  date: string;
  time: string;
  status: "예약완료" | "사용완료" | "취소됨";
  price: number;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출하여 예약 내역 가져오기
    // 임시 데이터
    setReservations([
      {
        id: "1",
        spaceName: "회의실 A",
        date: "2024-03-20",
        time: "14:00",
        status: "예약완료",
        price: 50000,
      },
      {
        id: "2",
        spaceName: "스터디룸 B",
        date: "2024-03-15",
        time: "10:00",
        status: "사용완료",
        price: 30000,
      },
    ]);
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "예약완료":
        return "bg-blue-100 text-blue-800";
      case "사용완료":
        return "bg-green-100 text-green-800";
      case "취소됨":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">예약 내역</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                공간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.spaceName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reservation.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reservation.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.price.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
