'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      // if (!isAdmin()) { // 관리자 권한 체크 일시적 비활성화
      //   toast.error('관리자 권한이 필요한 페이지입니다.');
      //   router.push('/login');
      // }
    }
  }, [isAdmin, isLoading, router]);

  // if (isLoading || !isAdmin()) { // 로딩 중 또는 관리자 아닌 경우 스피너 표시 로직 일시적 비활성화
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

  const getPageTitle = (currentPath: string) => {
    if (currentPath.endsWith('/dashboard')) return '대시보드';
    if (currentPath.endsWith('/users')) return '사용자 관리';
    if (currentPath.includes('/spaces')) return '공간 매물 관리';
    if (currentPath.includes('/reservations')) return '예약/결제 관리';
    if (currentPath.includes('/reviews')) return '후기/신고 관리';
    if (currentPath.includes('/announcements')) return '공지사항/이벤트';
    if (currentPath.includes('/statistics')) return '통계';
    return '관리자 페이지';
  };

  return <AdminLayout pageTitle={getPageTitle(pathname)}>{children}</AdminLayout>;
}
