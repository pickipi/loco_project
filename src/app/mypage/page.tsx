"use client";

import { useState, useEffect } from "react";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  totalReservations: number;
  totalPayments: number;
}

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    totalReservations: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    // TODO: API 호출하여 사용자 정보 가져오기
    // 임시 데이터
    setUserInfo({
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      totalReservations: 5,
      totalPayments: 250000,
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">내 정보</h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  이름
                </label>
                <p className="mt-1 text-gray-900">{userInfo.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <p className="mt-1 text-gray-900">{userInfo.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  전화번호
                </label>
                <p className="mt-1 text-gray-900">{userInfo.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">이용 현황</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  총 예약 횟수
                </label>
                <p className="mt-1 text-gray-900">
                  {userInfo.totalReservations}회
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  총 결제 금액
                </label>
                <p className="mt-1 text-gray-900">
                  {userInfo.totalPayments.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
