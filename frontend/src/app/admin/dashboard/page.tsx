'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/Card';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalSales: number;
  totalReservations: number;
  totalUsers: number;
  totalSpaces: number;
}

interface RecentReservation {
  id: number;
  user: string;
  space: string;
  date: string;
  status: string;
}

interface PendingSpace {
  id: number;
  name: string;
  owner: string;
  submitted: string;
}

interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface ReservationData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
  const [pendingSpaces, setPendingSpaces] = useState<PendingSpace[]>([]);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API 엔드포인트로 변경
        const [statsRes, reservationsRes, spacesRes, salesRes, reservationStatsRes] = await Promise.all([
          fetch('/api/v1/admin/dashboard/summary'),
          fetch('/api/v1/admin/dashboard/recent-reservations'),
          fetch('/api/v1/admin/dashboard/pending-spaces'),
          fetch('/api/v1/admin/dashboard/sales-data'),
          fetch('/api/v1/admin/dashboard/reservation-stats')
        ]);

        if (!statsRes.ok || !reservationsRes.ok || !spacesRes.ok || !salesRes.ok || !reservationStatsRes.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const [statsData, reservationsData, spacesData, salesData, reservationStatsData] = await Promise.all([
          statsRes.json(),
          reservationsRes.json(),
          spacesRes.json(),
          salesRes.json(),
          reservationStatsRes.json()
        ]);

        setStats(statsData);
        setRecentReservations(reservationsData);
        setPendingSpaces(spacesData);
        setSalesData(salesData);
        setReservationData(reservationStatsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>총 매출</CardHeader>
          <CardContent className="text-2xl font-semibold">
            ₩{stats?.totalSales.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>총 예약</CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.totalReservations.toLocaleString()}건
          </CardContent>
        </Card>
        <Card>
          <CardHeader>총 회원</CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.totalUsers.toLocaleString()}명
          </CardContent>
        </Card>
        <Card>
          <CardHeader>총 공간</CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.totalSpaces.toLocaleString()}개
          </CardContent>
        </Card>
      </div>

      {/* 그래프 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>월별 매출</CardHeader>
          <CardContent>
            {salesData && <Bar data={salesData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: '월별 매출 현황',
                },
              },
            }} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>월별 예약</CardHeader>
          <CardContent>
            {reservationData && <Line data={reservationData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: '월별 예약 현황',
                },
              },
            }} />}
          </CardContent>
        </Card>
      </div>

      {/* 최근 예약 및 처리대기 공간 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>최근 예약</CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">회원</th>
                    <th className="text-left py-2">공간</th>
                    <th className="text-left py-2">일자</th>
                    <th className="text-left py-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{r.user}</td>
                      <td className="py-2">{r.space}</td>
                      <td className="py-2">{r.date}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          r.status === '완료' ? 'bg-green-100 text-green-800' :
                          r.status === '진행중' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>처리대기 공간</CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">공간명</th>
                    <th className="text-left py-2">호스트</th>
                    <th className="text-left py-2">신청일</th>
                    <th className="text-left py-2">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSpaces.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{s.name}</td>
                      <td className="py-2">{s.owner}</td>
                      <td className="py-2">{s.submitted}</td>
                      <td className="py-2">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">승인</button>
                        <button className="text-red-600 hover:text-red-800">반려</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 