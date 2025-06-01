"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/header/header";
import api from "@/lib/axios";
import { uploadImageToS3 } from "@/services/s3Service";
import { useAuth } from "@/context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// 모달 컴포넌트: 닉네임 변경
// ─────────────────────────────────────────────────────────────────────────────
function ChangeUsernameModal({
  show,
  onClose,
  currentUsername,
  onSubmit,
}: {
  show: boolean;
  onClose: () => void;
  currentUsername: string;
  onSubmit: (newUsername: string) => Promise<void>;
}) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim() === "") {
      setError("닉네임을 입력해주세요");
      return;
    }
    try {
      setIsSubmitting(true);
      await onSubmit(newUsername);
      onClose();
    } catch {
      setError("닉네임 변경에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">닉네임 변경</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="새로운 닉네임"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 모달 컴포넌트: 연락처 변경
// ─────────────────────────────────────────────────────────────────────────────
function ChangePhoneModal({
  show,
  onClose,
  currentPhone,
  onSubmit,
}: {
  show: boolean;
  onClose: () => void;
  currentPhone: string;
  onSubmit: (newPhone: string) => Promise<void>;
}) {
  const [newPhone, setNewPhone] = useState(currentPhone);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numbersOnly = newPhone.replace(/-/g, "");
    if (!numbersOnly.match(/^\d{10,11}$/)) {
      setError("올바른 전화번호 형식이 아닙니다");
      return;
    }
    try {
      setIsSubmitting(true);
      const formattedPhone = numbersOnly.replace(
        /(\d{3})(\d{3,4})(\d{4})/,
        "$1-$2-$3"
      );
      await onSubmit(formattedPhone);
      onClose();
    } catch {
      setError("전화번호 변경에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">연락처 변경</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => {
              const input = e.target.value;
              const cleaned = input.replace(/[^\d-]/g, "");
              const formatted = cleaned.replace(
                /(\d{3})(\d{4})(\d{4})/,
                "$1-$2-$3"
              );
              setNewPhone(formatted);
            }}
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="새로운 연락처 (예: 010-1234-5678)"
            maxLength={13}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트: 마이페이지
// ─────────────────────────────────────────────────────────────────────────────
export default function Mypage() {
  const router = useRouter();
  const { updateUserName } = useAuth();

  const [userId, setUserId] = useState<string>("");
  const [realName, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isKakaoLinked, setIsKakaoLinked] = useState(true);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── 로컬스토리지 + 서버에서 사용자 정보 가져오기 ────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") || "";
      const storedRealName = localStorage.getItem("realName") || "";
      const storedUsername = localStorage.getItem("username") || "";
      const storedEmail = localStorage.getItem("email") || "";
      const storedPhone = localStorage.getItem("phoneNumber") || "";
      const storedProfileImage = localStorage.getItem("profileImage");

      setUserId(storedUserId);
      setRealName(storedRealName || storedUsername || "");
      setUsername(storedUsername || "");
      setEmail(storedEmail || "");
      setPhone(storedPhone || "");
      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      }

      // 서버 API 호출
      api
        .get(`/users/${storedUserId}`)
        .then((response) => {
          const userInfo = response.data;
          if (userInfo) {
            setRealName(userInfo.realName || userInfo.username);
            setUsername(userInfo.username);
            setPhone(userInfo.phoneNumber);
            setEmail(userInfo.email);
            if (userInfo.imageUrl) {
              setProfileImage(userInfo.imageUrl);
            }
          }
        })
        .catch(() => {
          console.log("API 호출 실패, 로컬 데이터 사용");
        });
    }
  }, [router]);

  // ─── 프로필 정보를 다시 가져오는 함수 ───────────────────────────────────
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${userId}`);
      const userInfo = response.data;

      if (userInfo) {
        setRealName(userInfo.realName || userInfo.username);
        setUsername(userInfo.username);
        setPhone(userInfo.phoneNumber);
        setEmail(userInfo.email);
        if (userInfo.imageUrl) {
          setProfileImage(userInfo.imageUrl);
        }
      }

      localStorage.setItem("username", userInfo.username);
      localStorage.setItem("userName", userInfo.username); // Header용
      localStorage.setItem("phoneNumber", userInfo.phoneNumber);
      localStorage.setItem("email", userInfo.email);
      if (userInfo.imageUrl) {
        localStorage.setItem("profileImage", userInfo.imageUrl);
      }
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 닉네임 변경 핸들러 ─────────────────────────────────────────────────
  const handleUsernameChange = async (newUsername: string) => {
    try {
      setIsLoading(true);
      await api.put(`/users/${userId}`, {
        username: newUsername,
        phoneNumber: phone,
      });
      await fetchUserProfile();
      setUsername(newUsername);
      setRealName(newUsername);

      localStorage.setItem("username", newUsername);
      localStorage.setItem("userName", newUsername);
      localStorage.setItem("realName", newUsername);

      updateUserName(newUsername);
      window.location.reload();
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 연락처 변경 핸들러 ─────────────────────────────────────────────────
  const handlePhoneChange = async (newPhone: string) => {
    try {
      setIsLoading(true);
      await api.put(`/users/${userId}`, {
        username,
        phoneNumber: newPhone,
      });
      await fetchUserProfile();
      setPhone(newPhone);
      localStorage.setItem("phoneNumber", newPhone);
      window.location.reload();
    } catch (error) {
      console.error("연락처 변경 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 프로필 이미지 변경 핸들러 ─────────────────────────────────────────
  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      setIsLoading(true);
      const uploadResponse = await uploadImageToS3(file);
      const imageUrl = uploadResponse.imageUrl;
      await api.put(`/users/${userId}/profile-image`, { imageUrl });
      setProfileImage(imageUrl);
      localStorage.setItem("profileImage", imageUrl);
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);
      alert("프로필 이미지 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 렌더링 시작 ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        <div className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-white shadow-sm">
          {/* ── Left: 프로필 이미지 영역 ───────────────────────────────────── */}
          <div className="w-full md:w-1/3 bg-white px-6 py-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative w-28 h-28">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="프로필 이미지"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 text-white flex items-center justify-center text-4xl font-bold">
                  {username.charAt(0).toUpperCase() || ""}
                </div>
              )}
            </div>
            <div className="text-center mt-3">
              <p className="font-semibold text-lg text-gray-800">{realName}</p>
              <button
                className="text-sm text-blue-600 hover:underline mt-1"
                onClick={() => fileInputRef.current?.click()}
              >
                프로필 사진 변경
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>
          </div>

          {/* ── Right: 사용자 정보 목록 ───────────────────────────────────── */}
          <div className="w-full md:w-2/3 px-6 py-8 space-y-6">
            {/* 닉네임 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">닉네임</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{realName}</span>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowUsernameModal(true)}
                >
                  변경하기
                </button>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">이메일</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{email}</span>
                <span className="text-sm text-green-600">인증됨</span>
              </div>
            </div>

            {/* 연락처 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">연락처</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{phone}</span>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowPhoneModal(true)}
                >
                  변경하기
                </button>
              </div>
            </div>

            {/* SNS 연동 상태 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">SNS 연동</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    isKakaoLinked ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  카카오 연동 {isKakaoLinked ? "완료" : "미완료"}
                </span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isKakaoLinked}
                    readOnly
                  />
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${
                      isKakaoLinked ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        isKakaoLinked ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* 비밀번호 변경 링크 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">비밀번호</span>
              <Link
                href="/mypage/change-password"
                className="text-sm text-blue-600 hover:underline"
              >
                비밀번호 변경
              </Link>
            </div>

            {/* 서비스 탈퇴 버튼 */}
            <div className="pt-6 text-center border-t border-gray-100">
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={async () => {
                  if (
                    confirm(
                      "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                    )
                  ) {
                    try {
                      setIsLoading(true);
                      await api.delete(`/users/${userId}`);
                      localStorage.clear();
                      router.push("/");
                    } catch {
                      console.error("회원 탈퇴 실패:");
                      alert("회원 탈퇴에 실패했습니다.");
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
              >
                서비스 탈퇴하기
              </button>
            </div>
          </div>
        </div>

        {/* 닉네임 변경 모달 */}
        <ChangeUsernameModal
          show={showUsernameModal}
          onClose={() => setShowUsernameModal(false)}
          currentUsername={username}
          onSubmit={handleUsernameChange}
        />

        {/* 연락처 변경 모달 */}
        <ChangePhoneModal
          show={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          currentPhone={phone}
          onSubmit={handlePhoneChange}
        />
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="text-center text-sm text-gray-400">
          © 2025 LoCo Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}