'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

// API 응답 타입 정의
interface UploadResponse {
  resultCode: string;
  msg: string;
  data: UserProfileResponseDto;
}

// 프로필 응답 DTO 타입 정의
interface UserProfileResponseDto {
  imageUrl: string;
  // 다른 프로필 정보들이 있다면 여기에 추가
}

// 이미지 업데이트 요청 DTO 타입 정의
interface UserProfileImageUpdateRequestDto {
  imageUrl: string;
}

export default function ProfileImagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setError('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/host/login');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/host/login');
        return;
      }

      const requestData: UserProfileImageUpdateRequestDto = {
        imageUrl: selectedImage
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/profile-image`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/host/login');
          return;
        }
        throw new Error('프로필 이미지 업데이트에 실패했습니다.');
      }

      const result: UploadResponse = await response.json();
      
      if (result.resultCode === 'S-1') {
        router.push('/host/profile');
        router.refresh();
      } else {
        throw new Error(result.msg || '프로필 이미지 업데이트에 실패했습니다.');
      }
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>프로필 사진 변경</h1>
      </div>

      <div className={styles.uploadBox}>
        <div 
          className={styles.imagePreview}
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt="프로필 이미지 미리보기"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>클릭하여 이미지 선택</span>
              <span className={styles.subText}>또는 드래그하여 업로드</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className={styles.fileInput}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleUpload}
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? '업로드 중...' : '변경하기'}
          </button>
        </div>
      </div>
    </div>
  );
} 