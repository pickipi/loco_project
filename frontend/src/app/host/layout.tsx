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

    // AuthContext 로딩이 완료된 후에만 (isLoading이 false) 로직 실행
    if (!isLoading) {

      // 1. 로그인 상태가 아니고, 호스트 메인 페이지(/host)가 아닌 경우 로그인 페이지로 리다이렉트
      // 로그인 페이지(/host/login) 자체는 이 조건에 걸리지 않습니다.
      if (!isLoggedIn && !isMainPage && !isLoginPage) {
        console.log("Redirecting: User not logged in and not on public/login page.");
        toast.error("호스트 권한이 필요합니다.");
        router.push("/host/login");
      }

      // 2. 로그인 상태이지만 호스트 역할이 아닌 경우 로그인 페이지로 리다이렉트
      if (isLoggedIn && userRole !== "HOST") {
           console.log("Redirecting: User logged in but not HOST role.");
           toast.error("호스트 계정으로 로그인해주세요.");
           // logout(); // AuthProvider에서 처리하는 것이 더 안전합니다.
           router.push("/host/login");
      }
      
      // 3. 로그인 상태이고 호스트 역할이며 로그인 페이지에 있다면 호스트 메인 페이지(/host)로 리다이렉트
      if (isLoggedIn && userRole === "HOST" && isLoginPage) {
           console.log("Redirecting: User is logged in as HOST and on login page.");
           router.push("/host"); // /host로 리다이렉트
      }
    } else if (isLoggedIn === false && isMainPage) {
       // 4. 로딩 완료 후, 비로그인 상태이고 호스트 메인 페이지인 경우 - 아무것도 하지 않고 /host 페이지 유지
       console.log("Staying on /host: User is not logged in.");
    } else if (isLoading) {
      // 5. 로딩 중일 때는 아무것도 하지 않고 기다립니다.
      console.log("AuthContext is still loading. Waiting...");
    }
    // 그 외의 경우 (예: isLoggedIn이 null인 상태 등) - 로딩이 끝날 때까지 기다립니다. 이는 !isLoading 조건에서 이미 처리됩니다.

  }, [pathname, isMainPage, isLoginPage, isLoggedIn, userRole, isLoading, router]);

  // AuthProvider에서 로그인/로그아웃 함수를 제공하므로 HostLayout에서는 필요 없음

  // 로딩 중일 때 로딩 스피너 등을 표시할 수 있습니다.
  if (isLoading) {
    // return <div>로딩 중...</div>; // 로딩 UI 표시
    // 초기 로딩 시 빈 화면이 뜨는 것을 방지하려면 AuthProvider 레벨에서 로딩 UI를 제공하는 것이 좋습니다.
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
