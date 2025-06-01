"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/header";
import api from "@/lib/axios";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("비밀번호는 대문자를 포함해야 합니다.");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError("비밀번호는 소문자를 포함해야 합니다.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("비밀번호는 숫자를 포함해야 합니다.");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError("비밀번호는 특수문자(!@#$%^&*)를 포함해야 합니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 비밀번호 확인
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 유효성 검사
    if (!validatePassword(newPassword)) {
      return;
    }

    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }

      await api.put(`/api/v1/users/${userId}/password`, {
        currentPassword,
        newPassword,
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      router.push("/mypage");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "비밀번호 변경에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">비밀번호 변경</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              현재 비밀번호
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              새 비밀번호
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              새 비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p className="text-sm text-gray-600">
            비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를
            포함해야 합니다.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "변경중..." : "변경하기"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
