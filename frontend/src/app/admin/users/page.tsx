'use client';

import UserManagement from '@/components/admin/UserManagement';
import AdminLayout from '@/components/AdminLayout';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  );
}
