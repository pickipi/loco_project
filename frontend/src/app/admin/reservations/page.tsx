'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/Card';

// TODO: 실제 예약 데이터 타입 정의 필요
interface Reservation {
  id: number;
  user: string; // 예약 사용자
  spaceName: string; // 예약 공간 이름
  startTime: string; // 예약 시작 시간
  endTime: string; // 예약 종료 시간
  totalPrice: number; // 총 결제 금액
  status: string; // 예약 상태 (예: pending, confirmed, cancelled)
  paymentStatus: string; // 결제 상태 (예: paid, unpaid, refunded)
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // TODO: 실제 백엔드 예약 목록 조회 API 엔드포인트로 변경
        // const response = await fetch('/api/v1/admin/reservations'); // 예시 API 경로
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // console.log('예약 목록 가져오기 성공:', data);

        // TODO: 백엔드 응답 구조에 맞게 데이터 설정
        // 현재는 예시 데이터 사용
        const mockReservations: Reservation[] = [
          {
            id: 1,
            user: '김철수',
            spaceName: '모던한 회의실',
            startTime: '2024-03-27 10:00',
            endTime: '2024-03-27 12:00',
            totalPrice: 50000,
            status: 'confirmed',
            paymentStatus: 'paid',
          },
          {
            id: 2,
            user: '이영희',
            spaceName: '스튜디오B',
            startTime: '2024-03-28 14:00',
            endTime: '2024-03-28 17:00',
            totalPrice: 90000,
            status: 'pending',
            paymentStatus: 'unpaid',
          },
          {
            id: 3,
            user: '박지민',
            spaceName: '카페 공간',
            startTime: '2024-03-29 09:00',
            endTime: '2024-03-29 11:00',
            totalPrice: 30000,
            status: 'confirmed',
            paymentStatus: 'paid',
          },
          {
            id: 4,
            user: '최수진',
            spaceName: '파티룸',
            startTime: '2024-03-30 19:00',
            endTime: '2024-03-30 22:00',
            totalPrice: 150000,
            status: 'cancelled',
            paymentStatus: 'refunded',
          },
          {
            id: 5,
            user: '정민호',
            spaceName: '연습실',
            startTime: '2024-03-31 13:00',
            endTime: '2024-03-31 15:00',
            totalPrice: 40000,
            status: 'confirmed',
            paymentStatus: 'paid',
          },
          {
            id: 6,
            user: '한소희',
            spaceName: '스튜디오A',
            startTime: '2024-04-01 11:00',
            endTime: '2024-04-01 14:00',
            totalPrice: 120000,
            status: 'pending',
            paymentStatus: 'unpaid',
          }
        ];

        setReservations(mockReservations);
        setError(null);

      } catch (err) {
        console.error('예약 목록 로딩 중 오류 발생:', err);
        setError('예약 목록을 불러오는데 실패했습니다.');
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">예약 및 결제 내역</h1>

      {loading ? (
        <p>예약 목록을 불러오는 중...</p>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : reservations.length === 0 ? (
        <p>등록된 예약이 없습니다.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약번호
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약 사용자
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약 공간
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약 시간
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    총 결제 금액
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약 상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 상태
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.spaceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.startTime} - {reservation.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₩{reservation.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.paymentStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* TODO: 상세 보기, 취소 등 액션 버튼 추가 */}
                      <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2">상세</a>
                      <a href="#" className="text-red-600 hover:text-red-900">취소</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 