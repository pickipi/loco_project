'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface CreateBoardRequest {
  title: string;
  description: string;
  category: string;
  isVisible: boolean;
  spaceId: number;
}

interface Space {
  id: number;
  spaceName: string;
  description: string;
}

const BoardRegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateBoardRequest>({
    title: '',
    description: '',
    category: 'NORMAL',
    isVisible: true,
    spaceId: 0, // 초기값을 0으로 설정
  });

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true);
  const [spaceError, setSpaceError] = useState<string>('');

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [otherImageFiles, setOtherImageFiles] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [otherImagePreviews, setOtherImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  // 호스트의 공간 목록 불러오기
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSpaceError('로그인이 필요합니다.');
          return;
        }

        // JWT 토큰에서 hostId 추출
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        const hostId = payload.sub;

        const response = await api.get(`/api/v1/spaces/host/${hostId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.length > 0) {
          setSpaces(response.data);
          // 첫 번째 공간을 기본 선택
          setFormData(prev => ({ ...prev, spaceId: response.data[0].id }));
        } else {
          setSpaceError('등록된 공간이 없습니다. 먼저 공간을 등록해주세요.');
        }
      } catch (error) {
        console.error('공간 목록 불러오기 실패:', error);
        setSpaceError('공간 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingSpaces(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setOtherImageFiles(prev => [...prev, ...files].slice(0, 5)); // 최대 5개까지만
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setOtherImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeOtherImage = (index: number) => {
    setOtherImageFiles(prev => prev.filter((_, i) => i !== index));
    setOtherImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isVisible', formData.isVisible.toString());
      formDataToSend.append('spaceId', formData.spaceId.toString());

      if (thumbnailFile) {
        formDataToSend.append('thumbnailFile', thumbnailFile);
      }

      otherImageFiles.forEach(file => {
        formDataToSend.append('otherImageFiles', file);
      });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      // JWT 토큰에서 hostId 추출
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      const hostId = payload.sub; // JWT의 sub 클레임에서 hostId를 가져옴

      const response = await api.post(`/api/v1/boards/${hostId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        alert('게시글이 성공적으로 등록되었습니다.');
        router.push('/host/board/list'); // 게시글 목록 페이지로 이동
      }
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      setError('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
        
        {(error || spaceError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error || spaceError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 공간 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공간 선택
            </label>
            {isLoadingSpaces ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : (
              <select
                name="spaceId"
                value={formData.spaceId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">공간을 선택하세요</option>
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.spaceName}
                  </option>
                ))}
              </select>
            )}
            {spaceError && (
              <p className="mt-1 text-sm text-red-600">
                {spaceError}
              </p>
            )}
          </div>

          {/* 제목 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="NORMAL">일반</option>
              <option value="EVENT">이벤트</option>
              <option value="NOTICE">공지사항</option>
            </select>
          </div>

          {/* 공개 여부 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              게시글 공개
            </label>
          </div>

          {/* 썸네일 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 이미지
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleThumbnailChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              썸네일 선택
            </button>
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="썸네일 미리보기"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* 추가 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 이미지 (최대 5장)
            </label>
            <input
              type="file"
              ref={multipleFileInputRef}
              onChange={handleOtherImagesChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => multipleFileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              이미지 추가
            </button>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {otherImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`추가 이미지 ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '등록 중...' : '게시글 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardRegisterPage;
