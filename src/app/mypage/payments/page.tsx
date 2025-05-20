"use client";

import { useState, useEffect } from "react";

interface Payment {
  id: string;
  orderName: string;
  amount: number;
  status: "결제완료" | "결제취소";
  paymentMethod: string;
  paidAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출하여 결제 내역 가져오기
    // 임시 데이터
    setPayments([
      {
        id: "1",
        orderName: "회의실 A 예약",
        amount: 50000,
        status: "결제완료",
        paymentMethod: "신용카드",
        paidAt: "2024-03-20 14:00:00",
      },
      {
        id: "2",
        orderName: "스터디룸 B 예약",
        amount: 30000,
        status: "결제완료",
        paymentMethod: "신용카드",
        paidAt: "2024-03-15 10:00:00",
      },
    ]);
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "결제완료":
        return "bg-green-100 text-green-800";
      case "결제취소":
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
      <h1 className="text-2xl font-bold mb-6">결제 내역</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제수단
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제일시
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.orderName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.amount.toLocaleString()}원
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.paidAt}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
