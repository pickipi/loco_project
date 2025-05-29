"use client";

import { createContext, useContext, useEffect, useState } from "react";

// 로그인 상태를 위한 Context 타입 정의 - 로그인 상태 유지
export interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  login: (token: string, userId: string, userName: string) => void;
  logout: () => void;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Context Provider 컴포넌트 (필요하다면 사용)
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [userName, setUserName] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUserId = localStorage.getItem('userId');
//     const storedUserName = localStorage.getItem('userName');

//     if (token && storedUserId) {
//       setIsLoggedIn(true);
//       setUserId(storedUserId);
//       setUserName(storedUserName);
//     } else {
//       setIsLoggedIn(false);
//       setUserId(null);
//       setUserName(null);
//     }
//   }, []);

//   const login = (token: string, id: string, name: string) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('userId', id);
//     localStorage.setItem('userName', name);
//     setIsLoggedIn(true);
//     setUserId(id);
//     setUserName(name);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userName');
//     setIsLoggedIn(false);
//     setUserId(null);
//     setUserName(null);
//   };

//   const authContextValue = { isLoggedIn, userId, userName, login, logout };

//   return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
// };

// Context 훅 생성
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
