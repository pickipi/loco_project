'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

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

interface FavoriteSpace {
  id: number;
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  pricePerHour: number;
}

export default function MyPage() {
  const router = useRouter();
  const [guestId, setGuestId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [favorites, setFavorites] = useState<FavoriteSpace[]>([]);
  const [activeTab, setActiveTab] = useState<'reservations' | 'payments' | 'favorites'>('reservations');
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

  // 2. 예약/결제/찜 내역 가져오기 (guestId가 있을 때만)
  useEffect(() => {
    if (!guestId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`${API_BASE_URL}/api/v1/mypage/reservations/${guestId}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/v1/mypage/payments/${guestId}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/v1/spaces/favorites`, { credentials: 'include' }).then(res => res.json())
    ])
      .then(([reservations, payments, favorites]) => {
        setReservations(reservations);
        setPayments(payments);
        setFavorites(favorites.data || []);
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
        <button
          className={`px-4 py-2 ${activeTab === 'favorites' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('favorites')}
        >
          찜 목록
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

      {/* 찜 목록 */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.length === 0 ? (
            <p className="text-gray-500 text-center py-8 col-span-full">찜한 공간이 없습니다.</p>
          ) : (
            favorites.map(space => (
              <div key={space.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={space.imageUrl || '/placeholder.png'}
                    alt={space.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{space.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{space.address}</p>
                  <p className="text-gray-800 font-medium">
                    {space.pricePerHour.toLocaleString()}원/시간
                  </p>
                  <button
                    onClick={() => router.push(`/spaces/${space.id}`)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
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