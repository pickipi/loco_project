"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuth2SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const email = params.get("email");  // 백엔드가 전달한 이메일
    const name = params.get("name"); // 'name' 파라미터 추가
    const phone = params.get("phone"); // 'phone' 파라미터 추가
    const role = params.get("role"); // 역할 정보 추가

    if (token) {
      localStorage.setItem("token", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (email) {
      localStorage.setItem("email", email);
      // 이메일 앞부분만 ID로 쓰고 싶다면
      const idPart = email.split("@")[0];
      localStorage.setItem("username", idPart);
    }

    // 'name' 파라미터가 있으면 localStorage에 'realName'으로 저장
    if (name) {
      localStorage.setItem("realName", name);
    }

    // 'phone' 파라미터가 있으면 localStorage에 'phoneNumber'으로 저장
    if (phone) {
      localStorage.setItem("phoneNumber", phone);
    }

    // 역할에 따른 리다이렉트 처리
    if (role === 'HOST') {
      router.replace("/host");
    } else {
      router.replace("/");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">로그인 처리 중입니다…</p>
    </div>
  );
} 