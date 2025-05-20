'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Reservation {
  id: number;
  guestId: number;
  startTime: string;
  endTime: string;
  status: string;
}

interface Payment {
  id: number;
  guestId: number;
  paymentMethod: string;
  paymentAmount: number;
  paymentStatus: string;
  paymentAt: string;
}

export default function MyPage() {
  const router = useRouter();
  const [guestId, setGuestId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState<'reservations' | 'payments'>('reservations');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. 게스트 ID 가져오기
  useEffect(() => {
    const fetchGuestId = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('로그인 정보가 없습니다.');
        const user = await res.json();
        if (!user.guestId) throw new Error('게스트 정보가 없습니다.');
        setGuestId(user.guestId);
      } catch (err: any) {
        setError(err.message || '게스트 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuestId();
  }, []);

  // 2. 예약/결제 내역 가져오기 (guestId가 있을 때만)
  useEffect(() => {
    if (!guestId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/v1/mypage/reservations/${guestId}`).then(res => res.json()),
      fetch(`/api/v1/mypage/payments/${guestId}`).then(res => res.json())
    ])
      .then(([reservations, payments]) => {
        setReservations(reservations);
        setPayments(payments);
        setError(null);
      })
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [guestId]);

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">로딩 중...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      {/* 탭 메뉴 */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'reservations' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('reservations')}
        >
          예약 내역
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'payments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('payments')}
        >
          결제 내역
        </button>
      </div>

      {/* 예약 내역 */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">예약 내역이 없습니다.</p>
          ) : (
            reservations.map(reservation => (
              <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">예약 #{reservation.id}</h3>
                    <p className="text-gray-600">시작: {new Date(reservation.startTime).toLocaleString()}</p>
                    <p className="text-gray-600">종료: {new Date(reservation.endTime).toLocaleString()}</p>
                    <p className="text-gray-600">상태: {reservation.status}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/reservation/${reservation.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 결제 내역 */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">결제 내역이 없습니다.</p>
          ) : (
            payments.map(payment => (
              <div key={payment.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">결제 #{payment.id}</h3>
                    <p className="text-gray-600">결제 방법: {payment.paymentMethod}</p>
                    <p className="text-gray-600">결제 금액: {payment.paymentAmount.toLocaleString()}원</p>
                    <p className="text-gray-600">결제 상태: {payment.paymentStatus}</p>
                    <p className="text-gray-600">결제 일시: {new Date(payment.paymentAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/payment/${payment.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 