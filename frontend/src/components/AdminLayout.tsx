'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { 
    LayoutDashboard,
    Users, 
    Building, 
    Calendar, 
    FileText, 
    Megaphone, 
    BarChart2, 
    Home, 
    BookOpen 
} from 'lucide-react'; // 아이콘 라이브러리 (설치 필요)

// 사이드바 메뉴 항목
const adminNavItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { href: '/admin/users', icon: Users, label: '사용자 관리' },
    { href: '/admin/spaces', icon: Building, label: '공간 매물 관리' }, // TODO: 실제 경로로 수정
    { href: '/admin/reservations', icon: Calendar, label: '예약/결제 관리' }, // TODO: 실제 경로로 수정
    { href: '/admin/reviews', icon: FileText, label: '후기/신고 관리' }, // TODO: 실제 경로로 수정
    { href: '/admin/announcements', icon: Megaphone, label: '공지사항/이벤트' }, // TODO: 실제 경로로 수정
    { href: '/admin/statistics', icon: BarChart2, label: '통계' }, // TODO: 실제 경로로 수정
];

const hostNavItems = [
    { href: '/host/spaces', icon: Home, label: '내 공간 관리' }, // TODO: 실제 경로로 수정
    { href: '/host/reservations', icon: BookOpen, label: '예약 관리' }, // TODO: 실제 경로로 수정
];

interface AdminLayoutProps {
    children: ReactNode;
    pageTitle: string;
}

export default function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* 좌측 사이드바 */}
            <div className="w-64 bg-[#4E342E] text-white flex flex-col">
                <div className="flex items-center justify-center h-16 bg-[#3E2723]">
                    <Logo width={85} height={25} colorScheme="light" />
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {adminNavItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                     <div className="border-t border-gray-700 my-4"></div> {/* 구분선 */}
                     <div className="px-2 text-xs font-semibold text-gray-400">호스트 기능</div>
                     {hostNavItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 상단 헤더 */}
                <header className="flex items-center justify-between h-16 bg-white shadow-sm px-6">
                    <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
                    {/* 관리자 정보 영역 */}
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-3">관리자</span> {/* TODO: 실제 관리자 이름/역할 */}
                         <span className="text-sm text-gray-500">admin@spacecloud.com</span> {/* TODO: 실제 관리자 이메일 */}
                         {/* TODO: 관리자 프로필 이미지 또는 아이콘 */}
                    </div>
                </header>

                {/* 페이지 콘텐츠 (children) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 