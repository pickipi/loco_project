import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // /admin 경로로 접속 시 /admin/dashboard로 리다이렉트
  redirect('/admin/dashboard');
} 