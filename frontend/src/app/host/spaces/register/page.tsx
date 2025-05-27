"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpaceTypeSelector, {
  SpaceType,
} from "@/components/space/SpaceTypeSelector";
import styles from "./page.module.css";

export default function SpaceTypePage() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<SpaceType[]>([]);

  // 컴포넌트 마운트 시 호스트 로그인 체크
  useEffect(() => {
    // 토큰 확인
    const token = localStorage.getItem("token");
    if (!token) {
      alert("호스트 로그인이 필요한 서비스입니다.");
      router.push("/host/login");
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      // 호스트가 아닌 경우
      if (payload.role !== "HOST") {
        alert("호스트만 공간을 등록할 수 있습니다.");
        router.push("/host/login");
        return;
      }
    } catch (error) {
      console.error("토큰 파싱 오류:", error);
      alert("인증 정보가 올바르지 않습니다.");
      router.push("/host/login");
    }
  }, [router]);

  const handleNext = () => {
    if (selectedTypes.length > 0) {
      // 선택된 공간 유형을 localStorage에 저장
      localStorage.setItem("selectedSpaceTypes", JSON.stringify(selectedTypes));
      router.push("/host/spaces/register/details");
    }
  };

  return (
    <main className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>공간 유형 선택</h1>
        <div className={styles.spacer} />
      </div>

      {/* 공간 유형 선택 */}
      <div className={styles.content}>
        <SpaceTypeSelector
          selectedTypes={selectedTypes}
          onChange={setSelectedTypes}
        />
      </div>

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        <button
          onClick={() => router.back()}
          className={styles.buttonSecondary}
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={selectedTypes.length === 0}
          className={
            selectedTypes.length > 0
              ? styles.buttonPrimary
              : styles.buttonDisabled
          }
        >
          다음
        </button>
      </div>
    </main>
  );
}
