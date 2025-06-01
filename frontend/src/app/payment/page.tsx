"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import api from '@/lib/axios'; // API 호출을 위해 axios 인스턴스 import

interface PaymentInfo {
  spaceName: string; // space 대신 spaceName 사용
  date: string;
  time: string;
  amount: number; // 임시 금액, 실제로는 백엔드에서 계산된 금액을 받아와야 함
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const spaceId = searchParams.get('spaceId'); // space 대신 spaceId 읽기
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    spaceName: "",
    date: date || "",
    time: time || "",
    amount: 0, // 초기 금액 0
  });

  const [loadingSpace, setLoadingSpace] = useState(true); // 공간 정보 로딩 상태

  useEffect(() => {
    // URL 파라미터 유효성 검사
    if (!spaceId || !date || !time) {
      console.error("결제 정보가 불완전합니다.");
      // 에러 상태 표시 또는 리다이렉트 처리 필요
      setLoadingSpace(false);
      return;
    }

    // spaceId로 공간 정보 가져오기
    const fetchSpaceDetail = async () => {
      try {
        const response = await api.get(`/spaces/${spaceId}`);
        if (response.data && response.data.data) {
          const spaceData = response.data.data;
          setPaymentInfo(prevInfo => ({
            ...prevInfo,
            spaceName: spaceData.spaceName, // 공간 이름 설정
            amount: spaceData.price, // 공간 가격으로 결제 금액 설정 (임시)
          }));
        } else {
          console.error('공간 정보를 가져오는데 실패했습니다.');
          // 에러 상태 표시 필요
        }
      } catch (error) {
        console.error("공간 정보 가져오는 중 오류 발생:", error);
        // 에러 상태 표시 필요
      } finally {
        setLoadingSpace(false);
      }
    };

    fetchSpaceDetail();
  }, [spaceId, date, time]); // spaceId, date, time이 변경될 때마다 실행

  const handlePayment = async () => {
    if (!paymentInfo.spaceName || paymentInfo.amount <= 0 || !paymentInfo.date || !paymentInfo.time) {
        alert("결제 정보가 불완전합니다.");
        return;
    }

    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("카드", {
        amount: paymentInfo.amount,
        orderId: `order_${Date.now()}`,
        orderName: `${paymentInfo.spaceName} 예약`,
        customerName: "홍길동", // 실제로는 사용자 정보에서 가져와야 함
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
       // 사용자에게 오류 메시지 표시
    }
  };

  // 로딩 중이거나 공간 정보가 없으면 로딩 메시지 표시
  if (loadingSpace || !paymentInfo.spaceName) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          결제 정보 로딩 중...
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">결제</h1>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">예약 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">공간</p>
                <p className="font-medium">{paymentInfo.spaceName}</p> {/* spaceName 표시 */}
              </div>
              <div>
                <p className="text-gray-600">날짜</p>
                <p className="font-medium">{paymentInfo.date}</p>
              </div>
              <div>
                <p className="text-gray-600">시간</p>
                <p className="font-medium">{paymentInfo.time}</p>
              </div>
              <div>
                <p className="text-gray-600">결제 금액</p>
                <p className="font-medium">
                  {paymentInfo.amount.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
