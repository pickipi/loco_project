'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpaceCard from '@/components/space/SpaceCard';

interface Space {
  id: string;
  name: string;
  description: string;
  address: string;
  price: number;
  mainImageUrl: string;
  capacity: number;
  rating: number;
  reviewCount: number;
}

export default function AllSpacesPage() {
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch('/api/v1/spaces/all');
        if (!response.ok) {
          throw new Error('Failed to fetch spaces');
        }
        const data = await response.json();
        setSpaces(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '공간 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">모든 공간</h1>
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800"
          >
            돌아가기
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              {...space}
            />
          ))}
        </div>

        {spaces.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            등록된 공간이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
