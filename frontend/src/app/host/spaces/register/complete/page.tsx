"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function RegisterCompletePage() {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className={styles.title}>저장이 완료되었습니다!</h1>
        <p className={styles.description}>
          공간 등록이 성공적으로 완료되었습니다.
          <br />
          호스트 페이지에서 등록한 공간을 확인하실 수 있습니다.
        </p>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => router.push("/host/spaces/list")}
            className={styles.primaryButton}
          >
            공간 목록 보기
          </button>{" "}
          <button
            onClick={() => router.push("/host/spaces/register")}
            className={styles.secondaryButton}
          >
            새로운 공간 등록하기
          </button>
        </div>
      </div>
    </main>
  );
}
