'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      if (!isAdmin()) {
        toast.error('관리자 권한이 필요한 페이지입니다.');
        router.push('/login');
      }
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.endsWith('/dashboard')) return '대시보드';
    if (path.endsWith('/users')) return '사용자 관리';
    if (path.includes('/spaces')) return '공간 매물 관리';
    if (path.includes('/reservations')) return '예약/결제 관리';
    if (path.includes('/reviews')) return '후기/신고 관리';
    if (path.includes('/announcements')) return '공지사항/이벤트';
    if (path.includes('/statistics')) return '통계';
    return '관리자 페이지';
  };

  return <AdminLayout pageTitle={getPageTitle()}>{children}</AdminLayout>;
}
