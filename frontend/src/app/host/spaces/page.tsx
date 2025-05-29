'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SpaceCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 토큰과 role 확인
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'HOST') {
      alert('호스트 로그인이 필요합니다.');
      router.push('/host/login');
      return;
    }

    // axios 기본 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [router]);

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
      }

      // 이미지 업로드
      const imageUrls = await uploadImagesToS3(formData.images);

      // 공간 등록 데이터 형식 변환
      const spaceData = {
        name: formData.spaceName,
        description: formData.spaceDescription,
        address: formData.address,
        detailAddress: formData.addressDetail,
        zipCode: formData.zipCode,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        price: parseInt(formData.rentalFee),
        openingHours: formData.openingHours,
        closingHours: formData.closingHours,
        phoneNumber: formData.phoneNumber,
        imageUrls: imageUrls,
        type: formData.type,
        capacity: parseInt(formData.maxCapacity),
        parkingAvailable: formData.parkingAvailable,
        petAvailable: formData.petAvailable,
        smokingAvailable: formData.smokingAvailable,
        hasKitchen: formData.hasKitchen,
        hasRestroom: formData.hasRestroom,
        facilities: formData.facilities
      };

      // 공간 등록
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/spaces`,
        spaceData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.resultCode === 'S-1') {
        alert('공간이 성공적으로 등록되었습니다.');
        router.push('/host');
      } else {
        throw new Error(response.data.msg || '공간 등록에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('공간 등록 오류:', err);
      if (err.response?.status === 403) {
        setError('권한이 없습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/host/login');
      } else {
        setError(err.response?.data?.msg || err.message || '공간 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImagesToS3 = async (files: File[]) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/spaces/images/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.resultCode === 'S-1') {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '이미지 업로드에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('이미지 업로드 오류:', err);
      if (err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/host/login');
      }
      throw err;
    }
  };

  // ... 나머지 컴포넌트 코드 ...
} 