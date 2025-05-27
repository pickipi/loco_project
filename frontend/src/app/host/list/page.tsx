'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Space {
  id: number;
  spaceName: string;
  description: string;
  address: string;
  maxCapacity: number;
  pricePerHour: number;
  isApproved: boolean;
  thumbnailUrl?: string;
  hostId: number; // 호스트 ID 추가
}

interface PageResponse {
  content: Space[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface RsData<T> {
  resultCode: string;
  msg: string;
  data: T;
}

const HostSpaceListPage = () => {
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  // 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      const timer = setTimeout(() => {
        router.push('/host/login');
      }, 2000);
      setError('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      setIsLoading(false);
      return () => clearTimeout(timer);
    }
  }, [router]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // JWT 토큰에서 hostId 추출
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        const hostId = payload.userId;

        const response = await api.get<RsData<PageResponse>>('/api/v1/spaces/all', {
          params: {
            page: currentPage,
            size: pageSize,
            sort: 'id,desc'  // 최신순으로 정렬
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.resultCode.startsWith('S-')) {
          // 현재 호스트의 공간만 필터링
          const hostSpaces = response.data.data.content.filter(space => space.hostId === hostId);
          setSpaces(hostSpaces);
          
          // 필터링된 공간의 개수로 페이지 수 계산
          const totalHostSpaces = Math.ceil(hostSpaces.length / pageSize);
          setTotalPages(totalHostSpaces);
          setError('');
        } else {
          setError(response.data.msg || '공간 목록을 불러오는데 실패했습니다.');
        }
      } catch (error: any) {
        console.error('공간 목록 불러오기 실패:', error);
        if (error.response?.status === 404) {
          setError('공간 정보를 찾을 수 없습니다.');
        } else if (error.response?.status === 405) {
          setError('잘못된 요청입니다.');
        } else if (error.response?.status === 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (error.response?.data?.msg) {
          setError(error.response.data.msg);
        } else {
          setError('공간 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchSpaces();
    }
  }, [router, currentPage]);

  const handleRegisterClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        router.push('/host/login');
      }, 2000);
      return;
    }
    router.push('/host/spaces/register');
  };

  const handleDetailClick = (spaceId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        router.push('/host/login');
      }, 2000);
      return;
    }
    router.push(`/host/space/${spaceId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  if (isLoading) {
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

  if (error && error.includes('로그인이 필요한 서비스입니다')) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800 text-lg mb-4">{error}</p>
          <div className="animate-pulse">
            <div className="h-2 bg-blue-200 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">내 공간 목록</h1>
        <button
          onClick={handleRegisterClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          새 공간 등록
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button
            onClick={handleRegisterClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            공간 등록하러 가기
          </button>
        </div>
      )}

      {!error && spaces.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">등록된 공간이 없습니다.</p>
          <button
            onClick={handleRegisterClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            첫 공간 등록하기
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <div key={space.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {space.thumbnailUrl ? (
                    <img
                      src={space.thumbnailUrl}
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
                      space.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {space.isApproved ? '승인됨' : '승인 대기중'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{space.spaceName}</h2>
                  <p className="text-gray-600 text-sm mb-2">{space.address}</p>
                  <p className="text-gray-700 mb-4">
                    최대 {space.maxCapacity}명 · {space.pricePerHour.toLocaleString()}원/시간
                  </p>
                  
                  <button
                    onClick={() => handleDetailClick(space.id)}
                    className={`w-full py-2 rounded-lg ${
                      space.isApproved
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    {space.isApproved ? '상세보기' : '승인 대기중'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-4 py-2 rounded ${
                      currentPage === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HostSpaceListPage;
