"use client";

import { Inter } from "next/font/google";
import HostHeader from "@/components/header/hostheader";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HostNavbar from "@/components/HostNavbar";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
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

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    console.log("Layout useEffect triggered");
    console.log("Current pathname:", pathname);
    
    setMounted(true);

    const token = window.localStorage.getItem("token");
    const storedUserId = window.localStorage.getItem("userId");
    const storedUserName = window.localStorage.getItem("userName");
    const storedUserRole = window.localStorage.getItem("userRole");

    console.log("Stored values:", {
      token: token ? "exists" : "null",
      userId: storedUserId,
      userName: storedUserName,
      userRole: storedUserRole
    });

    if (token && storedUserId && storedUserRole === "HOST") {
      console.log("User is logged in as HOST");
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
      setUserRole(storedUserRole);
      
      if (isLoginPage) {
        console.log("Redirecting from login page to spaces");
        router.push("/host/spaces");
      }
    } else {
      console.log("User is not logged in or not HOST");
      if (!isLoginPage) {
        console.log("Redirecting to login page");
        toast.error("호스트 권한이 필요합니다.");
        router.push("/host/login");
      }
    }
  }, [pathname, router, isLoginPage]);

  const login = (token: string, id: string, name: string, role: string) => {
    console.log("Login function called with:", { id, name, role });
    
    if (role !== "HOST") {
      console.log("Login rejected: Not a HOST role");
      toast.error("호스트 계정으로 로그인해주세요.");
      return;
    }
    
    console.log("Storing login data in localStorage");
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("userId", id);
    window.localStorage.setItem("userName", name);
    window.localStorage.setItem("userRole", role);
    
    console.log("Updating state");
    setIsLoggedIn(true);
    setUserId(id);
    setUserName(name);
    setUserRole(role);
    
    console.log("Showing success toast and redirecting");
    toast.success("로그인 성공!");
    router.push("/host/spaces");
  };

  const logout = () => {
    console.log("Logout function called");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
    setUserRole(null);
    toast.success("로그아웃 되었습니다.");
    router.push("/host/login");
  };

  const authContextValue: AuthContextType = {
    isLoggedIn,
    userId,
    userName,
    userRole,
    login,
    logout,
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
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
    </AuthContext.Provider>
  );
}
