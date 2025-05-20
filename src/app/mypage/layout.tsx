"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/mypage", label: "내 정보" },
    { href: "/mypage/reservations", label: "예약 내역" },
    { href: "/mypage/payments", label: "결제 내역" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 사이드바 */}
        <div className="w-full md:w-64">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
