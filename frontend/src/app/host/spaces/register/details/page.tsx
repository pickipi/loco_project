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
  openTime: string;
  closeTime: string;
  minTime: string;
  maxTime: string;
  refundPolicy: string;
  spaceRules: string;
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
    openTime: "",
    closeTime: "",
    minTime: "1",
    maxTime: "4",
    refundPolicy: "",
    spaceRules: "",
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
      latitude: data.latitude,
      longitude: data.longitude,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. 이미지 업로드
      if (formDataState.images.length === 0) {
        const errorMessage = '이미지를 선택해주세요.';
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const uploadFormData = new FormData();
      formDataState.images.forEach(file => {
        uploadFormData.append('files', file);
      });

      // JWT 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        const errorMessage = '로그인 정보가 없습니다. 다시 로그인 해주세요.';
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      console.log("Uploading images...");

      const uploadResponse = await fetch(`${API_BASE_URL}/api/v1/spaces/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("Image upload failed response:", errorData);
        const errorMessage = '이미지 업로드 실패: ' + (errorData.msg || uploadResponse.statusText);
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const uploadResult = await uploadResponse.json();
      console.log("Image upload result:", uploadResult);

      const imageUrls: string[] = uploadResult.data;

      console.log("Uploaded Image URLs:", imageUrls);

      toast.success("이미지 업로드 성공! 다음 단계로 이동하세요.");
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    // 현재 단계의 필수 필드만 검증 후 다음 단계로 이동
    if (activeStep === 2) { // 기본 정보 탭
      if (!formDataState.name || !formDataState.description || formDataState.description.length < 20 || !formDataState.address) {
        alert('공간 이름, 공간 소개(20자 이상), 주소는 필수 입력 항목입니다.');
        return;
      }
    } else if (activeStep === 3) { // 공간 정보 탭
      if (!formDataState.capacity || !formDataState.price || parseInt(formDataState.price) < 1000 || formDataState.images.length === 0) {
        alert('수용 인원, 시간당 가격(1000원 이상), 공간 사진은 필수 입력 항목입니다.');
        return;
      }
    }
    // 단계 4 (이용 규칙)에서는 현재 필수 필드 없음

    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-8">공간 등록하기</h1>

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

          <form onSubmit={handleSubmit}>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
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
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          return false;
                        }
                        if (file.size > 3 * 1024 * 1024) {
                          // 3MB 제한
                          return false;
                        }
                        return true;
                      });

                      if (imageFiles.length > 0) {
                        const totalImages =
                          formDataState.images.length + imageFiles.length;
                        if (totalImages > 10) {
                          alert("최대 10장까지만 업로드 가능합니다.");
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
                          if (file.size > 3 * 1024 * 1024) {
                            alert("각 이미지는 3MB를 초과할 수 없습니다.");
                            return false;
                          }
                          return true;
                        });

                        const totalImages = formDataState.images.length + validFiles.length;
                         if (totalImages > 10) {
                          alert("최대 10장까지만 업로드 가능합니다.");
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
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    환불 규정
                  </label>
                  <textarea
                    id="refundPolicy"
                    name="refundPolicy"
                    value={formDataState.refundPolicy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="환불 규정을 상세하게 입력해주세요."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    이용 규정
                  </label>
                  <textarea
                    id="spaceRules"
                    name="spaceRules"
                    value={formDataState.spaceRules}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="공간 이용 시 지켜야 할 규칙을 입력해주세요."
                  />
                </div>
              </div>
            )}

            {/* 버튼 영역 */}
            {activeStep >= 2 && activeStep <= 4 && (
              <div className="flex justify-between mt-10">
                {activeStep > 2 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    이전
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                   type={activeStep === 4 ? "submit" : "button"}
                   onClick={activeStep === 4 ? handleSubmit : nextStep}
                   className={`px-6 py-2 ${activeStep === 4 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'} rounded-md ${isLoading ? 'cursor-not-allowed' : ''}`}
                 >
                   {activeStep === 4 ? "등록 하기" : "다음"}
                 </button>
              </div>
            )}
            {activeStep === 1 && (
                 <div className="flex justify-end mt-10">
                     <button
                         type="button"
                         onClick={nextStep}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                          다음
                      </button>
                 </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
