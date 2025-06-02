"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function HostOAuth2SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const email = params.get("email");
    const name = params.get("name");
    const phone = params.get("phone");
    const role = params.get("role");
    const isNewUser = params.get("isNewUser") === "true";

    // 새로운 사용자인 경우 회원가입 페이지로 리다이렉트
    if (isNewUser) {
      const signupUrl = `/host/signup?email=${encodeURIComponent(email || '')}&name=${encodeURIComponent(name || '')}`;
      router.replace(signupUrl);
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (email) {
      localStorage.setItem("email", email);
      const idPart = email.split("@")[0];
      localStorage.setItem("username", idPart);
    }
    if (name) {
      localStorage.setItem("realName", name);
    }
    if (phone) {
      localStorage.setItem("phoneNumber", phone);
    }

    // 호스트 권한 체크
    if (role !== 'HOST') {
      alert('호스트 계정이 아닙니다.');
      router.replace('/host/login');
      return;
    }

    // 호스트 센터로 리다이렉트
    router.replace("/host");
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">호스트 로그인 처리 중입니다…</p>
    </div>
  );
} 