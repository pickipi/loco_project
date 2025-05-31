import React, { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  email: string;
  userType: "GUEST" | "HOST" | "ADMIN";
  phoneNumber: string;
  rating: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("사용자 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "GUEST" ? "HOST" : "GUEST";
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, userType: newRole } : user
      )
    );
    console.log(`프론트엔드 상태 업데이트: User ${userId}의 권한을 ${newRole}로 변경 시도`);

    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/admin/users/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`백엔드 API 호출 완료:`, response.data);
    } catch (error) {
      console.error("백엔드 API 호출 실패:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">사용자 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                사용자명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                전화번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                현재 권한
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                권한 변경
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {user.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {user.userType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.userType !== "ADMIN" && (
                    <Switch
                      checked={user.userType === "HOST"}
                      onChange={() => handleRoleToggle(user.id, user.userType)}
                      className={`${
                        user.userType === "HOST" ? "bg-blue-600" : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span className="sr-only">Toggle role</span>
                      <span
                        className={`${
                          user.userType === "HOST"
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
