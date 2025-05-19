"use client";

import { useEffect, useState } from "react";

interface Space {
  id: number;
  spaceName: string;
  address: string;
  status: string;
  rejectionReason?: string;
}

export default function SpaceApprovalPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    // 대기중(PENDING) 공간 리스트 불러오기
    fetch("/api/v1/spaces")
      .then((res) => res.json())
      .then((data) => {
        // PENDING 상태만 필터링
        const pendingSpaces = data.filter((s: Space) => s.status === "PENDING");
        setSpaces(pendingSpaces);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: number) => {
    await fetch(`/api/v1/admin/spaces/${id}/approve`, { method: "PUT" });
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReject = async (id: number) => {
    const reason = rejectionReasons[id] || "";
    await fetch(`/api/v1/admin/spaces/${id}/reject?reason=${encodeURIComponent(reason)}`, { method: "PUT" });
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">공간 승인/반려 관리</h1>
      {spaces.length === 0 ? (
        <div>대기중인 공간이 없습니다.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">공간명</th>
              <th className="p-2">주소</th>
              <th className="p-2">승인/반려</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id} className="border-t">
                <td className="p-2 text-center">{space.id}</td>
                <td className="p-2">{space.spaceName}</td>
                <td className="p-2">{space.address}</td>
                <td className="p-2 flex flex-col gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleApprove(space.id)}
                  >
                    승인
                  </button>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="반려 사유 입력"
                      value={rejectionReasons[space.id] || ""}
                      onChange={e => setRejectionReasons(prev => ({ ...prev, [space.id]: e.target.value }))}
                      className="border px-2 py-1 rounded text-sm"
                    />
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleReject(space.id)}
                    >
                      반려
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 