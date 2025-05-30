"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Reservation {
  id: number;
  guestName: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

export default function HostReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "rejected"
  >("all");

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `/api/v1/space-reservations/host/1?status=${filter}`
      ); // TODO: 실제 호스트 ID로 변경
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
      fetchReservations();
    } catch (error) {
      console.error("예약 상태 변경에 실패했습니다:", error);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "all") return true;
    return reservation.status.toLowerCase() === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">예약 관리</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            대기중
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded ${
              filter === "confirmed" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            확정
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded ${
              filter === "rejected" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            거절
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  {reservation.spaceName}
                </h2>
                <p className="text-gray-600">예약자: {reservation.guestName}</p>
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
                {reservation.status === "PENDING" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(reservation.id, "CONFIRMED")
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      확정
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(reservation.id, "REJECTED")
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      거절
                    </button>
                  </>
                )}
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
