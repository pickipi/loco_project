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

    // 저장 후 홈으로 이동
    router.replace("/");
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">로그인 처리 중입니다…</p>
    </div>
  );
} 