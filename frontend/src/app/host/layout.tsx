"use client";

import { Inter } from "next/font/google";
import HostHeader from "@/components/header/hostheader";
import { ThemeProvider } from "@/components/darkmode/ThemeContext";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HostNavbar from "../components/HostNavbar";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainPage = pathname === "/host";

  // Initialize with default values
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Set mounted to true after initial render
    setMounted(true);

    // Check localStorage only on client side
    const token = window.localStorage.getItem("token");
    const storedUserId = window.localStorage.getItem("userId");
    const storedUserName = window.localStorage.getItem("userName");

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, []);

  const login = (token: string, id: string, name: string) => {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("userId", id);
    window.localStorage.setItem("userName", name);
    setIsLoggedIn(true);
    setUserId(id);
    setUserName(name);
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
  };

  const authContextValue: AuthContextType = {
    isLoggedIn,
    userId,
    userName,
    login,
    logout,
  };

  // Return null or loading state before client-side hydration
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <ThemeProvider>
        <div
          className={`${inter.className} min-h-screen`}
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        >
          <HostHeader />
          <HostNavbar />
          <main
            style={{
              backgroundColor: "var(--bg-primary)",
              minHeight: "calc(100vh - 64px)",
            }}
          >
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
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
