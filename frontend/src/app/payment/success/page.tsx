"use client";

import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            결제가 완료되었습니다
          </h1>
          <p className="text-gray-600">
            예약이 성공적으로 완료되었습니다. 이메일로 예약 확인서가
            발송되었습니다.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
