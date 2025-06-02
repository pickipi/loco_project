"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "@/components/Calendar";
import TimeSelector from "@/components/TimeSelector";
import SpaceList from "@/components/SpaceList";
import api from '@/lib/axios';

interface ReservationState {
  selectedDate: Date | null;
  selectedTime: string;
  spaceId: string;
}

export default function ReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const spaceId = searchParams.get('spaceId') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';

  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!spaceId) {
      setError('공간 정보가 누락되었습니다.');
      setLoading(false);
      return;
    }

    const fetchSpaceDetail = async () => {
      try {
        const response = await api.get(`/api/v1/spaces/${spaceId}`);
        if (response.data && response.data.data) {
          setSpace(response.data.data);
        } else {
          setError('공간 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching space details:', error);
        setError('공간 정보를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetail();
  }, [spaceId]);

  const handleReservation = async () => {
    if (!isConfirmed) {
      alert("날짜와 시간이 맞는지 확인해주세요.");
      return;
    }
    
    if (!space || !date || !time) {
         alert("예약 정보가 불완전합니다.");
         return;
    }

    router.push(
      `/payment?spaceId=${space.id}&date=${date}&time=${time}`
    );
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">공간 예약 확인</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">선택하신 공간</h2>
          <div>
            <h3 className="text-lg font-medium mb-2">{space.spaceName}</h3>
            <p className="text-gray-600">{space.address}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">예약 날짜 및 시간 확인</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">선택된 날짜:</h3>
              <p>{date}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">선택된 시간:</h3>
              <p>{time}</p>
            </div>
            
            <div className="flex items-center mt-4">
              <input 
                type="checkbox" 
                id="confirm" 
                checked={isConfirmed} 
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="confirm">위 날짜와 시간이 맞습니까?</label>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleReservation}
          disabled={!isConfirmed}
          className={`px-6 py-3 rounded-lg transition-colors ${isConfirmed ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          예약하기
        </button>
      </div>
    </div>
  );
}
