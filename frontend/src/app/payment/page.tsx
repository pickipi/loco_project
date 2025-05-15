"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface PaymentInfo {
  space: string;
  date: string;
  time: string;
  amount: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    space: "",
    date: "",
    time: "",
    amount: 0,
  });

  useEffect(() => {
    // URL 파라미터에서 예약 정보 가져오기
    const space = searchParams.get("space");
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (space && date && time) {
      setPaymentInfo({
        space,
        date,
        time,
        amount: 50000, // 임시 금액, 실제로는 API에서 가져와야 함
      });
    }
  }, [searchParams]);

  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("카드", {
        amount: paymentInfo.amount,
        orderId: `order_${Date.now()}`,
        orderName: `${paymentInfo.space} 예약`,
        customerName: "홍길동", // 실제로는 사용자 정보에서 가져와야 함
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
    }
  };

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
                <p className="font-medium">{paymentInfo.space}</p>
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
