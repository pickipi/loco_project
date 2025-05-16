"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-gray-600">
            결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
