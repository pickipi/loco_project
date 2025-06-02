"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Camera, PartyPopper, Coffee, Upload } from "lucide-react";
import AddressSearch from "@/components/AddressSearch";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'react-toastify';

// DaumPostcode를 dynamic import로 불러오기
const DaumPostcode = dynamic(() => import("@/components/DaumPostcode"), {
  ssr: false,
});

//로컬 url 머지하면서 추가 --봉준님 확인하세요
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

interface SpaceFormData {
  name: string;
  type: string;
  description: string;
  address: string;
  detailAddress: string;
  capacity: string;
  price: string;
  images: File[];
  imageUrls: string[];
  openTime: string;
  closeTime: string;
  minTime: string;
  maxTime: string;
  refundPolicy: string;
  spaceRules: string;
  agreedRefundPolicy: boolean;
  agreedSpaceRules: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export default function RegisterSpacePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(2);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [formDataState, setFormDataState] = useState<SpaceFormData>({
    name: "",
    type: "",
    description: "",
    address: "",
    detailAddress: "",
    capacity: "",
    price: "",
    images: [],
    imageUrls: [],
    openTime: "",
    closeTime: "",
    minTime: "1",
    maxTime: "4",
    refundPolicy: "",
    spaceRules: "",
    agreedRefundPolicy: false,
    agreedSpaceRules: false,
  });
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // localStorage에서 선택된 공간 유형 가져오기
  useEffect(() => {
    const selectedTypes = localStorage.getItem("selectedSpaceTypes");
    if (selectedTypes) {
      const types = JSON.parse(selectedTypes);
      if (types.length > 0) {
        setFormDataState(prev => ({ ...prev, type: types[0] }));
      }
    }
  }, []);

  // 주소 검색 완료 핸들러
  const handleAddressComplete = (data: any) => {
    setFormDataState((prev) => ({
      ...prev,
      address: data.address,
      zonecode: data.zonecode,
      latitude: 37.5665, // 임시 위도 값
      longitude: 126.9780, // 임시 경도 값
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormDataState(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  // 토큰 유효성 검사 함수 수정
  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      const expirationTime = payload.exp * 1000;
      
      if (Date.now() >= expirationTime) {
        // 토큰 만료 시 모달 표시
        toast.error('인증이 만료되었습니다. 다시 로그인해주세요.', {
          onClose: () => {
            localStorage.removeItem('token');
            router.push('/host/login');
          }
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('토큰 검증 중 오류:', error);
      return false;
    }
  };

  // 이미지 업로드 함수 수정
  const handleImageUpload = async (): Promise<string[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 이미지 유효성 검사
      if (formDataState.images.length === 0) {
        const errorMessage = '이미지를 선택해주세요.';
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return null;
      }

      // 2. 토큰 유효성 검사
      if (!validateToken()) {
        const errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.';
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        router.push('/host/login');
        return null;
      }

      const token = localStorage.getItem('token');
      const uploadFormData = new FormData();
      formDataState.images.forEach(file => {
        uploadFormData.append('files', file);
      });

      console.log("Uploading images...");

      const uploadResponse = await fetch(`${API_BASE_URL}/api/v1/spaces/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData,
      });

      // 응답 상태 코드에 따른 처리
      if (uploadResponse.status === 401) {
        const errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
        setError(errorMessage);
        toast.error(errorMessage);
        localStorage.removeItem('token');
        router.push('/host/login');
        setIsLoading(false);
        return null;
      }

      if (!uploadResponse.ok) {
        let errorMessage = '이미지 업로드 실패';
        try {
          const errorData = await uploadResponse.json();
          errorMessage += ': ' + (errorData.msg || uploadResponse.statusText);
        } catch (e) {
          errorMessage += ': ' + uploadResponse.statusText;
        }
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return null;
      }

      // 응답 데이터 처리
      let uploadResult;
      try {
        uploadResult = await uploadResponse.json();
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        setError('서버 응답 처리 중 오류가 발생했습니다.');
        toast.error('서버 응답 처리 중 오류가 발생했습니다.');
        setIsLoading(false);
        return null;
      }

      if (!uploadResult.data || !Array.isArray(uploadResult.data)) {
        setError('서버 응답 형식이 올바르지 않습니다.');
        toast.error('서버 응답 형식이 올바르지 않습니다.');
        setIsLoading(false);
        return null;
      }

      const imageUrls: string[] = uploadResult.data;
      console.log("Uploaded Image URLs:", imageUrls);

      toast.success("이미지 업로드 성공!");
      return imageUrls;
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 최종 공간 등록 함수 (이미지 업로드 후 호출)
  const handleFinalSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // 기본 폼 제출 방지
      setIsLoading(true);
      setError(null);

      // 필수 필드 검증
      const requiredFields = {
          name: '공간 이름',
          type: '공간 유형',
          description: '공간 소개',
          address: '주소',
          capacity: '수용 인원',
          price: '가격',
          openTime: '운영 시작 시간',
          closeTime: '운영 종료 시간',
          refundPolicy: '환불 정책',
          spaceRules: '이용 규칙'
      };

      // for (const [field, label] of Object.entries(requiredFields)) {
      //     if (!formDataState[field as keyof SpaceFormData]) {
      //         const errorMessage = `${label}을(를) 입력해주세요.`;
      //         setError(errorMessage);
      //         toast.error(errorMessage);
      //         setIsLoading(false);
      //         return;
      //     }
      // }

      // 이미지 URL이 없으면 최종 제출 불가
      if (formDataState.imageUrls.length === 0) {
          const errorMessage = '이미지 업로드가 완료되지 않았습니다.';
          setError(errorMessage);
          toast.error(errorMessage);
          setIsLoading(false);
          return;
      }

      try {
          const token = localStorage.getItem('token');
          if (!token) {
              const errorMessage = '로그인 정보가 없습니다. 다시 로그인 해주세요.';
              setError(errorMessage);
              toast.error(errorMessage);
              setIsLoading(false);
              router.push('/host/login');
              return;
          }

          const submitPayload = {
              name: formDataState.name,
              type: formDataState.type,
              description: formDataState.description,
              address: formDataState.address,
              detailAddress: formDataState.detailAddress || "",
              capacity: parseInt(formDataState.capacity) || 1,
              price: parseInt(formDataState.price, 10),
              imageUrls: formDataState.imageUrls,
              refundPolicy: formDataState.refundPolicy,
              spaceRules: formDataState.spaceRules,
              neighborhoodInfo: "",
              latitude: formDataState.latitude || 37.5665,
              longitude: formDataState.longitude || 126.9780
          };

          console.log("Submitting space data:", submitPayload);

          const submitResponse = await fetch(`${API_BASE_URL}/api/v1/spaces/complete`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(submitPayload),
          });

          // 응답 상태 코드 로깅
          console.log("Response status:", submitResponse.status);
          
          // 응답 헤더 로깅
          console.log("Response headers:", Object.fromEntries(submitResponse.headers.entries()));

          let responseData;
          const responseText = await submitResponse.text();
          console.log("Raw response:", responseText);

          try {
              responseData = responseText ? JSON.parse(responseText) : null;
              console.log("Parsed response data:", responseData);
          } catch (e) {
              console.error("Failed to parse response as JSON:", e);
              throw new Error('서버 응답을 처리할 수 없습니다.');
          }

          if (!submitResponse.ok) {
              const errorMessage = responseData?.msg || '공간 등록에 실패했습니다.';
              console.error("Registration failed:", errorMessage);
              throw new Error(errorMessage);
          }

          if (!responseData) {
              throw new Error('서버로부터 응답을 받지 못했습니다.');
          }

          toast.success("공간이 성공적으로 등록되었습니다!");
          // 성공 후 리다이렉션
          router.push('/spaces'); // 모든 공간 목록 페이지로 이동

      } catch (error) {
          console.error('공간 등록 중 오류 발생:', error);
          const errorMessage = error instanceof Error ? error.message : '공간 등록 중 오류가 발생했습니다.';
          setError(errorMessage);
          toast.error(errorMessage);
      } finally {
          setIsLoading(false);
      }
  };

  const handleNextButtonClick = async () => {
    // 현재 단계에 따른 유효성 검사 및 다음 단계 이동 로직
    if (activeStep === 2) { // 기본 정보 탭
      if (!formDataState.name || !formDataState.description || formDataState.description.length < 20 || !formDataState.address) {
        toast.error('공간 이름, 공간 소개(20자 이상), 주소는 필수 입력 항목입니다.');
        return;
      }
      // 유효성 검사 통과 시 다음 단계로 이동
      setActiveStep(3); // 3단계(공간 정보)로 이동
    } else if (activeStep === 3) { // 공간 정보 탭
      if (!formDataState.capacity || !formDataState.price || parseInt(formDataState.price) < 1000 || formDataState.images.length === 0) {
        toast.error('수용 인원, 시간당 가격(1000원 이상), 공간 사진은 필수 입력 항목입니다.');
        return;
      }

      // 유효성 검사 통과 시 이미지 업로드 시도
      const uploadedImageUrls = await handleImageUpload();

      // 이미지 업로드 성공 시 (uploadedImageUrls가 null이 아닌 경우)
      if (uploadedImageUrls !== null) {
        // 업로드된 이미지 URL을 formDataState에 저장하고 다음 단계로 이동
        setFormDataState(prevState => ({ ...prevState, imageUrls: uploadedImageUrls }));
        setActiveStep(4); // 4단계(이용 규칙)로 이동
      }
      // 이미지 업로드 실패 시 로직은 handleImageUpload 내에서 처리됨
    }
    // 4단계에서는 '다음' 버튼이 없습니다. '등록하기' 버튼이 최종 제출을 처리합니다.
  };

  // '등록하기' 버튼 활성화 조건
  const isSubmitButtonEnabled = activeStep === 4 && formDataState.agreedRefundPolicy && formDataState.agreedSpaceRules && !isLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">공간 등록하기</h1>
          </div>

          {/* 단계 표시 */}
          <div className="flex justify-between items-center mb-10">
            {/* 단계 1: 공간 유형 */}
            <div
              className={`flex flex-col items-center ${
                activeStep >= 1 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <span className="text-sm">공간 유형</span>
            </div>
            {/* 구분선 */}
            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
            {/* 단계 2: 기본 정보 */}
            <div
              className={`flex flex-col items-center ${
                activeStep >= 2 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="text-sm">기본 정보</span>
            </div>
            {/* 구분선 */}
            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 3 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
            {/* 단계 3: 공간 정보 */}
            <div
              className={`flex flex-col items-center ${
                activeStep >= 3 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 3
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span className="text-sm">공간 정보</span>
            </div>
             {/* 구분선 */}
            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 4 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
             {/* 단계 4: 이용 규칙 */}
            <div
              className={`flex flex-col items-center ${
                activeStep >= 4 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 4
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                4
              </div>
              <span className="text-sm">이용 규칙</span>
            </div>
          </div>

          <form onSubmit={handleNextButtonClick}>
            {/* 단계 1: 기본 정보 */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    공간 이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formDataState.name}
                    onChange={handleInputChange}
                    placeholder="공간의 특징이 잘 드러나는 이름을 입력해주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    공간 소개
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formDataState.description}
                    onChange={handleInputChange}
                    placeholder="공간의 특징, 장점, 주요 시설 등을 자세히 소개해주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] text-black"
                    required
                    minLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    최소 20자 이상 작성해주세요
                  </p>
                </div>

                {/* 주소 입력 부분 */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formDataState.address}
                    onChange={handleInputChange}
                    placeholder="주소를 입력해주세요"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    required
                    readOnly
                  />
                  <div className="flex-shrink-0">
                    <AddressSearch onComplete={handleAddressComplete} />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="detailAddress"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    상세 주소
                  </label>
                  <input
                    type="text"
                    id="detailAddress"
                    name="detailAddress"
                    value={formDataState.detailAddress}
                    onChange={handleInputChange}
                    placeholder="상세 주소를 입력해주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                </div>
              </div>
            )}

            {/* 단계 2: 공간 정보 */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    수용 인원
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formDataState.capacity}
                      onChange={handleInputChange}
                      placeholder="최대 수용 가능한 인원"
                      className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      min="1"
                      required
                    />
                    <span className="ml-2">명</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    시간당 가격
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formDataState.price}
                      onChange={handleInputChange}
                      placeholder="시간당 가격을 입력해주세요"
                      className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      min="1000"
                      step="1000"
                      required
                    />
                    <span className="ml-2">원</span>
                  </div>
                </div>

                {/* 공간 사진 섹션 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    공간 사진
                  </label>
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-8
                             hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200
                             cursor-pointer flex flex-col items-center justify-center"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add(
                        "border-indigo-500",
                        "bg-indigo-50"
                      );
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove(
                        "border-indigo-500",
                        "bg-indigo-50"
                      );
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove(
                        "border-indigo-500",
                        "bg-indigo-50"
                      );

                      const files = Array.from(e.dataTransfer.files);
                      const imageFiles = files.filter((file) => {
                        if (!file.type.startsWith("image/")) {
                          toast.error('이미지 파일만 업로드할 수 있습니다.');
                          return false;
                        }
                        if (file.size > 3 * 1024 * 1024) {
                          toast.error('각 이미지는 3MB를 초과할 수 없습니다.');
                          return false;
                        }
                        return true;
                      });

                      if (imageFiles.length > 0) {
                        const totalImages =
                          formDataState.images.length + imageFiles.length;
                        if (totalImages > 10) {
                          toast.error("최대 10장까지만 업로드 가능합니다.");
                          return;
                        }
                        setFormDataState((prev) => ({
                          ...prev,
                          images: [...prev.images, ...imageFiles],
                        }));
                      }
                    }}
                    onClick={() =>
                      document.getElementById("spaceImageUpload")?.click()
                    }
                  >
                    <input
                      type="file"
                      id="spaceImageUpload"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles = files.filter((file) => {
                          if (!file.type.startsWith("image/")) {
                            toast.error('이미지 파일만 업로드할 수 있습니다.');
                            return false;
                          }
                          if (file.size > 3 * 1024 * 1024) {
                            toast.error("각 이미지는 3MB를 초과할 수 없습니다.");
                            return false;
                          }
                          return true;
                        });

                        const totalImages = formDataState.images.length + validFiles.length;
                         if (totalImages > 10) {
                          toast.error("최대 10장까지만 업로드 가능합니다.");
                          return;
                        }

                        setFormDataState((prev) => ({
                          ...prev,
                          images: [...prev.images, ...validFiles],
                        }));
                        e.target.value = ""; // input 초기화
                      }}
                    />
                    <div className="flex flex-col items-center text-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2">
                        여기를 클릭하거나 드래그하여 사진을 올려주세요
                      </p>
                      <p className="text-xs text-gray-500">
                        권장 크기: 1000x1000px / 최대 10장
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        파일당 최대 3MB
                      </p>
                    </div>
                  </div>

                  {/* 업로드된 이미지 미리보기 */}
                  {formDataState.images.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 text-sm text-gray-600">
                        업로드된 이미지 ({formDataState.images.length}/10)
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formDataState.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`미리보기 ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormDataState((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white
                                       rounded-full w-6 h-6 flex items-center justify-center
                                       opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 단계 3: 이용 규칙 */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    예약 단위
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2"
                    >
                      시간 단위
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                    >
                      일 단위
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    운영 시간
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="openTime"
                      value={formDataState.openTime}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    >
                      <option value="">시작 시간</option>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option
                          key={i}
                          value={`${i.toString().padStart(2, "0")}:00`}
                        >
                          {i.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                    <span>~</span>
                    <select
                      name="closeTime"
                      value={formDataState.closeTime}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    >
                      <option value="">종료 시간</option>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option
                          key={i}
                          value={`${i.toString().padStart(2, "0")}:00`}
                        >
                          {i.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    시간당 가격
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formDataState.price}
                      readOnly
                      className="w-40 px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <span>원</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    최소/최대 예약 시간
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="minTime"
                      value={formDataState.minTime}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    >
                      <option value="1">1시간</option>
                      <option value="2">2시간</option>
                      <option value="3">3시간</option>
                      <option value="4">4시간</option>
                    </select>
                    <span>~</span>
                    <select
                      name="maxTime"
                      value={formDataState.maxTime}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    >
                      <option value="4">4시간</option>
                      <option value="6">6시간</option>
                      <option value="8">8시간</option>
                      <option value="12">12시간</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    수용 인원
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`최소 인원: 1명 ~ 최대 인원: ${formDataState.capacity}명`}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                {/* 환불 규정 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    환불 규정
                  </label>
                  {/* 스크롤 가능한 환불 규정 안내문 */}
                  <div className="border border-gray-300 rounded-md p-4 h-40 overflow-y-auto text-sm text-gray-600">
                    {/* 환불 규정 내용 (임시) */}
                    <p>• 예약 후 24시간 이내 취소 시: 100% 환불</p>
                    <p>• 이용 예정일 7일 전까지 취소 시: 90% 환불</p>
                    <p>• 이용 예정일 3일 전까지 취소 시: 50% 환불</p>
                    <p>• 이용 예정일 3일 이내 취소 시: 환불 불가</p>
                    <p className="mt-2">* 천재지변 등 불가항력으로 인한 취소 시 전액 환불됩니다.</p>
                    <p>* 상세 환불 규정은 예약 시 확인 가능합니다.</p>
                  </div>
                  {/* 환불 규정 동의 체크박스 */}
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="agreedRefundPolicy"
                      name="agreedRefundPolicy"
                      checked={formDataState.agreedRefundPolicy}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      required
                    />
                    <label
                      htmlFor="agreedRefundPolicy"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      위 환불 규정을 읽고 동의합니다.
                    </label>
                  </div>
                </div>

                {/* 이용 규정 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이용 규정
                  </label>
                   {/* 스크롤 가능한 이용 규정 안내문 */}
                  <div className="border border-gray-300 rounded-md p-4 h-40 overflow-y-auto text-sm text-gray-600">
                    {/* 이용 규정 내용 (임시) */}
                    <p>• 공간 이용 시간은 예약 시간에 맞춰주세요.</p>
                    <p>• 시설물 훼손 시 배상 책임이 발생할 수 있습니다.</p>
                    <p>• 예약 인원을 초과하여 공간을 이용할 수 없습니다.</p>
                    <p>• 공간 내 금연입니다.</p>
                    <p className="mt-2">* 상세 이용 규정은 예약 확정 후 안내됩니다.</p>
                  </div>
                  {/* 이용 규정 동의 체크박스 */}
                   <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="agreedSpaceRules"
                      name="agreedSpaceRules"
                      checked={formDataState.agreedSpaceRules}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      required
                    />
                    <label
                      htmlFor="agreedSpaceRules"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      위 이용 규정을 읽고 동의합니다.
                    </label>
                  </div>
                </div>

                {/* 등록하기 버튼 */}
                <div className="mt-8">
                   <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={!isSubmitButtonEnabled}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isSubmitButtonEnabled ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    {isLoading ? '등록 중...' : '등록하기'}
                  </button>
                </div>
              </div>
            )}

            {/* 단계 이동 버튼 */}
            {activeStep < 4 && (
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextButtonClick}
                  disabled={isLoading} // 이미지 업로드 중에는 다음 버튼 비활성화
                  className="ml-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </form>

          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}

        </div>
      </div>
    </div>
  );
}
