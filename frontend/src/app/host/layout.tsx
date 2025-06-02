"use client";

import { Inter } from "next/font/google";
import HostHeader from "@/components/header/hostheader";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HostNavbar from "@/components/HostNavbar";
import {
  AuthContext,
  AuthContextType,
  AuthProvider,
  useAuth,
} from "@/context/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && !isMainPage && !isLoginPage) {
        console.log(
          "Redirecting: User not logged in and not on public/login page."
        );
        toast.error("호스트 권한이 필요합니다.");
        router.push("/host/login");
      }

      if (isLoggedIn && userRole !== "HOST") {
        console.log("Redirecting: User logged in but not HOST role.");
        toast.error("호스트 계정으로 로그인해주세요.");
        router.push("/host/login");
      }

      if (isLoggedIn && userRole === "HOST" && isLoginPage) {
        console.log(
          "Redirecting: User is logged in as HOST and on login page."
        );
        router.push("/host");
      }
    }
  }, [
    pathname,
    isMainPage,
    isLoginPage,
    isLoggedIn,
    userRole,
    isLoading,
    router,
  ]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <HostHeader />
        <HostNavbar />
        <div
          style={{
            maxWidth: isMainPage ? "100%" : "1200px",
            margin: "0 auto",
            padding: isMainPage ? "0" : "24px",
          }}
        />
        <main className="w-full">{children}</main>
        <ToastContainer />
      </div>
    </AuthProvider>
  );
} 
