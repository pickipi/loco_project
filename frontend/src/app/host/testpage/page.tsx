'use client'

import { useState } from 'react';
import styles from './page.module.css';
import HostLoginHeader from '@/components/header/hostloginheader';

// 더미 데이터 인터페이스
interface SpaceData {
  id: number;
  name: string;
  status: 'available' | 'booked' | 'maintenance';
  bookings: number;
  revenue: number;
  rating: number;
}

interface ReservationData {
  id: number;
  spaceName: string;
  customerName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export default function HostTestPage() {
  // 더미 공간 데이터
  const [spaces] = useState<SpaceData[]>([
    {
      id: 1,
      name: '강남 스튜디오',
      status: 'available',
      bookings: 24,
      revenue: 1200000,
      rating: 4.8
    },
    {
      id: 2,
      name: '홍대 연습실',
      status: 'booked',
      bookings: 18,
      revenue: 900000,
      rating: 4.5
    },
    {
      id: 3,
      name: '성수동 공유주방',
      status: 'maintenance',
      bookings: 15,
      revenue: 750000,
      rating: 4.7
    }
  ]);

  // 더미 예약 데이터
  const [reservations] = useState<ReservationData[]>([
    {
      id: 1,
      spaceName: '강남 스튜디오',
      customerName: '김철수',
      date: '2024-03-20',
      status: 'confirmed'
    },
    {
      id: 2,
      spaceName: '홍대 연습실',
      customerName: '이영희',
      date: '2024-03-21',
      status: 'pending'
    },
    {
      id: 3,
      spaceName: '성수동 공유주방',
      customerName: '박지민',
      date: '2024-03-22',
      status: 'completed'
    }
  ]);

  // 상태에 따른 배지 스타일 클래스 반환
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
      case 'confirmed':
        return styles.statusBadgeGreen;
      case 'booked':
      case 'pending':
        return styles.statusBadgeYellow;
      case 'maintenance':
      case 'cancelled':
        return styles.statusBadgeRed;
      case 'completed':
        return styles.statusBadgeBlue;
      default:
        return styles.statusBadgeGray;
    }
  };

  // 상태 한글 변환
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      available: '이용 가능',
      booked: '예약됨',
      maintenance: '점검 중',
      pending: '대기 중',
      confirmed: '확정됨',
      completed: '완료됨',
      cancelled: '취소됨'
    };
    return statusMap[status] || status;
  };

  return (
    <div className={styles.pageContainer}>
      <HostLoginHeader />
      <main className={styles.mainContent}>
        {/* 대시보드 헤더 */}
        <div className={styles.dashboardHeader}>
          <h1>호스트 대시보드</h1>
          <p>테스트 페이지입니다</p>
        </div>

        {/* 통계 카드 섹션 */}
        <section className={styles.statsSection}>
          <div className={styles.statCard}>
            <h3>총 공간</h3>
            <p className={styles.statNumber}>{spaces.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>이번 달 예약</h3>
            <p className={styles.statNumber}>
              {spaces.reduce((sum, space) => sum + space.bookings, 0)}
            </p>
          </div>
          <div className={styles.statCard}>
            <h3>총 수익</h3>
            <p className={styles.statNumber}>
              {spaces.reduce((sum, space) => sum + space.revenue, 0).toLocaleString()}원
            </p>
          </div>
          <div className={styles.statCard}>
            <h3>평균 평점</h3>
            <p className={styles.statNumber}>
              {(spaces.reduce((sum, space) => sum + space.rating, 0) / spaces.length).toFixed(1)}
            </p>
          </div>
        </section>

        {/* 공간 목록 섹션 */}
        <section className={styles.spacesSection}>
          <h2>등록된 공간</h2>
          <div className={styles.spacesGrid}>
            {spaces.map(space => (
              <div key={space.id} className={styles.spaceCard}>
                <div className={styles.spaceHeader}>
                  <h3>{space.name}</h3>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(space.status)}`}>
                    {getStatusText(space.status)}
                  </span>
                </div>
                <div className={styles.spaceStats}>
                  <div>
                    <p>예약 수</p>
                    <span>{space.bookings}</span>
                  </div>
                  <div>
                    <p>수익</p>
                    <span>{space.revenue.toLocaleString()}원</span>
                  </div>
                  <div>
                    <p>평점</p>
                    <span>⭐ {space.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 예약 목록 섹션 */}
        <section className={styles.reservationsSection}>
          <h2>최근 예약</h2>
          <div className={styles.reservationsList}>
            {reservations.map(reservation => (
              <div key={reservation.id} className={styles.reservationCard}>
                <div className={styles.reservationInfo}>
                  <h3>{reservation.spaceName}</h3>
                  <p>{reservation.customerName}</p>
                  <p>{reservation.date}</p>
                </div>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(reservation.status)}`}>
                  {getStatusText(reservation.status)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 