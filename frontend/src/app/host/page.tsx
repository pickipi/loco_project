"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import HostHeader from "@/components/header/hostheader";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface User {
  isLoggedIn: boolean;
}

export default function HostMainPage() {
  const router = useRouter();
  const { isLoggedIn, userRole } = useAuth();

  // 보호된 경로 접근 핸들러 (useAuth 상태 사용)
  const handleProtectedRoute = (path: string) => {
    if (!isLoggedIn || userRole !== "HOST") {
      alert("호스트 로그인이 필요한 서비스입니다.");
      router.push("/host/login?redirect=" + encodeURIComponent(path));
      return;
    }
    router.push(path);
  };

  return (
    <div className={styles.container}>
      {/* HostHeader는 HostLayout에 포함되므로 여기서 렌더링하지 않습니다. */}
      {/* <HostHeader /> */}

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>당신의 공간을 LOCO와 함께</h1>
        <p className={styles.heroSubtitle}>
          새로운 호스팅의 시작, LOCO와 함께하세요
        </p>
        <button
          onClick={() => handleProtectedRoute("/host/spaces")}
          className={styles.button}
        >
          호스트 시작하기
        </button>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>LOCO 호스트의 특별한 혜택</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🏠</div>
            <h3 className={styles.featureTitle}>간편한 공간 등록</h3>
            <p className={styles.featureDescription}>
              몇 번의 클릭만으로 당신의 공간을 등록할 수 있습니다.
            </p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📱</div>
            <h3 className={styles.featureTitle}>스마트한 예약 관리</h3>
            <p className={styles.featureDescription}>
              실시간 예약 관리와 알림으로 편리하게 관리하세요.
            </p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>안전한 정산 시스템</h3>
            <p className={styles.featureDescription}>
              투명하고 안전한 정산으로 신뢰할 수 있는 호스팅
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.section}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1,000+</div>
            <div className={styles.statLabel}>등록된 공간</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50,000+</div>
            <div className={styles.statLabel}>월간 예약</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>호스트 만족도</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>지금 바로 LOCO 호스트가 되어보세요</h2>
        <p className={styles.ctaDescription}>
          전문적인 호스트 매니저가 당신의 성공적인 호스팅을 도와드립니다
        </p>
        <button
          onClick={() => handleProtectedRoute("/host/spaces")}
          className={styles.button}
        >
          무료로 시작하기
        </button>
      </section>

      {/* Testimonials Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>호스트의 이야기</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialQuote}>
              "LOCO와 함께하면서 공간 관리가 훨씬 수월해졌어요. 예약부터
              정산까지 한 번에 해결할 수 있어서 좋습니다."
            </p>
            <div className={styles.testimonialAuthor}>김서연</div>
            <div className={styles.testimonialRole}>카페 운영자</div>
          </div>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialQuote}>
              "처음에는 걱정이 많았는데, LOCO의 호스트 매니저님이 친절하게
              도와주셔서 쉽게 시작할 수 있었어요."
            </p>
            <div className={styles.testimonialAuthor}>이준호</div>
            <div className={styles.testimonialRole}>스튜디오 대표</div>
          </div>
        </div>
      </section>
    </div>
  );
}
