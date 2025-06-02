"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// 로그인 상태를 위한 Context 타입 정의 - 로그인 상태 유지
export interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  isLoading: boolean;
  isAdmin: () => boolean;
  login: (token: string, id: string, name: string, role: string) => void;
  logout: () => void;
  updateUserName: (name: string) => void;
}

// Context 생성
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  userName: null,
  userRole: null,
  isLoading: true,
  isAdmin: () => false,
  login: () => {},
  logout: () => {},
  updateUserName: () => {},
});

// Context Provider 컴포넌트 (필요하다면 사용)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initAuth = () => {
      console.log("AuthProvider useEffect triggered");
      const token = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      const storedUserName = localStorage.getItem("userName");
      const storedUserRole = localStorage.getItem("userRole");

      if (token && storedUserId && storedUserRole) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
        setUserName(storedUserName);
        setUserRole(storedUserRole);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserName(null);
        setUserRole(null);
      }
      setIsLoading(false);
      console.log(
        "AuthProvider initialization finished. isLoggedIn:",
        isLoggedIn,
        "userRole:",
        userRole
      );
    };

    initAuth();
  }, []);

  const login = (token: string, id: string, name: string, role: string) => {
    console.log("AuthContext Login called", { id, name, role });
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    setIsLoggedIn(true);
    setUserId(id);
    setUserName(name);
    setUserRole(role);
  };

  const logout = () => {
    console.log("AuthContext Logout called");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
    setUserRole(null);
  };
  const isAdmin = React.useCallback(() => {
    console.log("isAdmin check:", { isLoggedIn, userRole });
    return Boolean(isLoggedIn && userRole === "ADMIN");
  }, [isLoggedIn, userRole]);

  const updateUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  const authContextValue = React.useMemo(
    () => ({
      isLoggedIn,
      userId,
      userName,
      userRole,
      isLoading,
      isAdmin,
      login,
      logout,
      updateUserName,
    }),
    [isLoggedIn, userId, userName, userRole, isLoading, isAdmin, login, logout]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Context 훅 생성
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
