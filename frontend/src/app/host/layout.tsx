"use client";

import { Inter } from "next/font/google";
import HostHeader from "@/components/header/hostheader";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HostNavbar from "@/components/HostNavbar";
import { AuthContext, AuthContextType, AuthProvider, useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === "/host";
  const isLoginPage = pathname === "/host/login";

  const { isLoggedIn, userId, userName, userRole, isLoading } = useAuth();

  // 마운트 상태 추적 (선택 사항, 필요시 사용)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log("HostLayout useEffect triggered");
    console.log("Current pathname:", pathname);
    console.log("isLoggedIn from useAuth:", isLoggedIn);
    console.log("userRole from useAuth:", userRole);
    console.log("isLoading from useAuth:", isLoading);

    // 컴포넌트가 마운트되고, AuthContext 로딩이 완료된 후에만 인증 체크 로직 실행
    if (isMounted && !isLoading) {
      // 로그인 상태가 아니고, 로그인 페이지도 아니며, 호스트 메인 페이지도 아닌 경우 로그인 페이지로 리다이렉트
      if (!isLoggedIn && !isLoginPage && !isMainPage) {
        console.log("User is not logged in and not on login or main page. Redirecting to login.");
        toast.error("호스트 권한이 필요합니다.");
        router.push("/host/login");
      }

      // 로그인 상태이고 호스트 역할이 아닌 경우 (일반 사용자) 로그인 페이지로 리다이렉트
      if (isLoggedIn && userRole !== "HOST") {
           console.log("User is logged in but not HOST. Redirecting to login.");
           toast.error("호스트 계정으로 로그인해주세요.");
           router.push("/host/login");
      }
      
      // 로그인 상태이고 호스트 역할이며 로그인 페이지에 있다면 호스트 메인 페이지(/host)로 리다이렉트
      if (isLoggedIn && userRole === "HOST" && isLoginPage) {
           console.log("User is logged in as HOST and on login page. Redirecting to /host.");
           router.push("/host"); // /host로 리다이렉트
      }
    }

  }, [pathname, isLoginPage, isMainPage, isLoggedIn, userRole, isLoading, router, isMounted]); // isLoading과 isMainPage 의존성 추가

  // AuthProvider에서 로그인/로그아웃 함수를 제공하므로 HostLayout에서는 필요 없음

  // 로딩 중일 때 로딩 스피너 등을 표시할 수 있습니다.
  if (isLoading) {
    // return <div>로딩 중...</div>; // 로딩 UI 표시
  }

  return (
    <AuthProvider>
      <div className={inter.className}>
        <HostHeader />
        <HostNavbar />
        <main>
          <div
            style={{
              maxWidth: isMainPage ? "100%" : "1200px",
              margin: "0 auto",
              padding: isMainPage ? "0" : "24px",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
