'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

// 개발 환경에서 API URL 로깅
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}

interface Space {
  id: number;
  spaceName: string;
  description: string;
  uploadDate: string;
  price: number;
  address: string;
  detailAddress: string;
  neighborhoodInfo: string | null;
  latitude: number;
  longitude: number;
  maxCapacity: number;
  isActive: boolean;
  spaceRating: number;
  imageUrl: string;
  additionalImageUrls: string[];
}

interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface SpaceResponse {
  content: Space[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: PageableSort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

const HostSpaceListPage = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, userRole } = useAuth();
  const [spaceData, setSpaceData] = useState<SpaceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchSpaces = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await api.get(
        `${API_BASE_URL}/api/v1/spaces/my-spaces`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('API 응답:', response.data);

      // RsData 구조에서 실제 데이터 추출
      if (response.data && response.data.data) {
  
        setSpaceData(response.data.data);
     
      } else {
    
        setSpaceData(response.data);
      }
      
      setError('');
    } catch (err: any) {
      console.error('공간 목록 불러오기 실패:', err);
      if (err.response?.status === 401) {
        setError('로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (err.response?.status === 404) {
        setError('호스트 정보를 찾을 수 없습니다.');
      } else {
        setError('공간 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchSpaces();
    }
  }, [authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button
            onClick={() => {
              setError('');
              setIsLoading(true);
              fetchSpaces();
            }}
            className="ml-4 text-blue-600 hover:text-blue-800 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const spaces = spaceData?.content || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-black">내가 등록한 공간</h1>
        <button
          onClick={() => router.push('/host/spaces/register')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          새 공간 등록
        </button>
      </div>

      {!error && spaces.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">등록된 공간이 없습니다.</p>
          <button
            onClick={() => router.push('/host/spaces/register')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            첫 공간 등록하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div key={space.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {space.imageUrl && space.imageUrl !== 'string' ? (
                  <img
                    src={space.imageUrl}
                    alt={space.spaceName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">이미지 없음</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    space.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {space.isActive ? '활성화' : '비활성화'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-black mb-2">{space.spaceName}</h2>
                <p className="text-gray-600 text-sm mb-2">{space.address} {space.detailAddress}</p>
                <p className="text-gray-700 mb-2">
                  최대 {space.maxCapacity}명 · {space.price.toLocaleString()}원/시간
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  평점: {space.spaceRating.toFixed(1)}
                </p>
                <button
                  onClick={() => router.push(`/host/spaces/list/${space.id}`)}
                  className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostSpaceListPage;
