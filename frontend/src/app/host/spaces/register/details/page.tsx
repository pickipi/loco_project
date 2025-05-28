"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Camera, PartyPopper, Coffee, Upload } from "lucide-react";
import AddressSearch from "@/components/AddressSearch";
import dynamic from "next/dynamic";
import api from "@/lib/axios";
import { SpaceCreateRequestDto } from "@/types/space";
import { useAuth } from "@/app/host/layout"; // HostLayout에서 정의한 useAuth 훅 임포트

// DaumPostcode를 dynamic import로 불러오기
const DaumPostcode = dynamic(() => import("@/components/DaumPostcode"), {
  ssr: false,
});

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
  zonecode?: string;
  latitude?: number;
  longitude?: number;
}

export default function RegisterSpacePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth(); // AuthContext에서 로그인 상태 가져오기
  const [activeStep, setActiveStep] = useState(2);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [formData, setFormData] = useState<SpaceFormData>({
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
  });
  const [rulesConfirmed, setRulesConfirmed] = useState(false);

  // localStorage에서 선택된 공간 유형 가져오기
  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인 및 리다이렉트
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/host/login');
      return; // 리다이렉트 후 함수 종료
    }

    const selectedTypes = localStorage.getItem("selectedSpaceTypes");
    if (selectedTypes) {
      const types = JSON.parse(selectedTypes);
      if (types.length > 0) {
        setFormData(prev => ({ ...prev, type: types[0] }));
      }
    }
  }, []);

  // 주소 검색 완료 핸들러
  const handleAddressComplete = (data: any) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 최종 제출 전 모든 필수 필드 검증
    if (!formData.name || !formData.description || formData.description.length < 20 || !formData.address) {
      alert('공간 이름, 공간 소개(20자 이상), 주소는 필수 입력 항목입니다.');
      return;
    }
    if (!formData.capacity || !formData.price || parseInt(formData.price) < 1000 || formData.images.length === 0) {
      alert('수용 인원, 시간당 가격(1000원 이상), 공간 사진은 필수 입력 항목입니다.');
      return;
    }
    // 단계 3 (이용 규칙)에서는 현재 필수 필드 없음

    try {
      // 1. 이미지 S3 업로드
      const imageUrls = await uploadImagesToS3(formData.images);

      // 2. 백엔드 SpaceCreateRequestDto 형식에 맞게 데이터 변환
      const spaceData: SpaceCreateRequestDto = {
          spaceName: formData.name,
          spaceType: formData.type,
          description: formData.description,
          address: formData.address + (formData.detailAddress ? ' ' + formData.detailAddress : ''),
          price: parseInt(formData.price),
          maxCapacity: parseInt(formData.capacity),
          openTime: formData.openTime,
          closeTime: formData.closeTime,
          minTime: parseInt(formData.minTime),
          maxTime: parseInt(formData.maxTime),
          imageUrls: imageUrls,
      };

      // TODO: 실제 호스트 ID를 Local Storage 등에서 가져오도록 수정 필요
      const hostId = localStorage.getItem('userId');

      // localStorage에서 가져온 userId를 숫자로 변환하고 유효성 검사
      const parsedHostId = hostId ? Number(hostId) : null;

      if (parsedHostId === null || isNaN(parsedHostId)) {
        alert('호스트 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        return;
      }

      // 3. 백엔드 공간 생성 API 호출
      const response = await api.post(`/api/v1/spaces/${parsedHostId}/register`, spaceData);

      if (response.status === 200) {
        alert("공간이 성공적으로 등록되었습니다!");
        router.push("/host/dashboard");
      } else {
         alert(`공간 등록 실패: ${response.data.message || response.statusText}`);
      }

    } catch (error) {
      console.error("공간 등록 오류:", error);
      // Axios 에러 처리
      if ((error as any).response) { // 타입 단언 사용
        alert(`공간 등록 중 오류가 발생했습니다: ${(error as any).response.data.message || (error as any).message}`);
      } else if ((error as any).request) { // 타입 단언 사용
        alert('공간 등록 요청 중 오류가 발생했습니다. 서버 응답이 없습니다.');
      } else {
        alert('공간 등록 요청 설정 중 오류가 발생했습니다.');
      }
    }
  };

  const uploadImagesToS3 = async (files: File[]): Promise<string[]> => {
      const imageUrls: string[] = [];
      const uploadUrl = `${API_BASE_URL}/api/v1/spaces/images/upload`;
      
      for (const file of files) {
          const formData = new FormData();
          formData.append('files', file);

          try {
              const uploadResponse = await api.post(uploadUrl, formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
              if (uploadResponse.data && uploadResponse.data.data && uploadResponse.data.data.length > 0) {
                   imageUrls.push(...uploadResponse.data.data);
              } else {
                  console.error('이미지 업로드 실패: 응답에 이미지 URL이 없습니다.', uploadResponse);
                  throw new Error('이미지 업로드 실패');
              }
          } catch (uploadError) {
              console.error('S3 이미지 업로드 오류:', uploadError);
               // Axios 에러 처리
              if ((uploadError as any).response) { // 타입 단언 사용
                alert(`이미지 업로드 중 오류가 발생했습니다: ${(uploadError as any).response.data.message || (uploadError as any).message}`);
              } else if ((uploadError as any).request) { // 타입 단언 사용
                alert('이미지 업로드 요청 중 오류가 발생했습니다. 서버 응답이 없습니다.');
              } else {
                alert('이미지 업로드 요청 설정 중 오류가 발생했습니다.');
              }
              throw new Error('이미지 업로드 실패'); // 공간 등록 중단
          }
      }
      return imageUrls;
  };

  const nextStep = () => {
    // 현재 단계의 필수 필드만 검증 후 다음 단계로 이동
    if (activeStep === 2) { // 기본 정보 탭
      if (!formData.name || !formData.description || formData.description.length < 20 || !formData.address) {
        alert('공간 이름, 공간 소개(20자 이상), 주소는 필수 입력 항목입니다.');
        return;
      }
    } else if (activeStep === 3) { // 공간 정보 탭
      if (!formData.capacity || !formData.price || parseInt(formData.price) < 1000 || formData.images.length === 0) {
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
                    value={formData.name}
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
                    value={formData.description}
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
                    value={formData.address}
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
                    value={formData.detailAddress}
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
                      value={formData.capacity}
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
                      value={formData.price}
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
                          formData.images.length + imageFiles.length;
                        if (totalImages > 10) {
                          alert("최대 10장까지만 업로드 가능합니다.");
                          return;
                        }
                        setFormData((prev) => ({
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

                        const totalImages = formData.images.length + validFiles.length;
                         if (totalImages > 10) {
                          alert("최대 10장까지만 업로드 가능합니다.");
                          return;
                        }

                        setFormData((prev) => ({
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
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 text-sm text-gray-600">
                        업로드된 이미지 ({formData.images.length}/10)
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
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
                                setFormData((prev) => ({
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
                <h3 className="text-lg font-medium text-gray-700">이용 규칙 및 환불 규정</h3>
                {/* 여기에 이용 규칙 및 환불 규정 내용을 표시합니다. */}
                {/* 실제 내용을 채워 넣거나 백엔드에서 불러오도록 수정해야 합니다. */}
                <div className="border p-4 rounded-md bg-gray-50 text-gray-700 text-sm max-h-60 overflow-y-auto">
                  <p><strong>[이용 규칙]</strong></p>
                  <p>1. 공간 내 흡연은 엄격히 금지됩니다.</p>
                  <p>2. 시설물 훼손 시 손해배상이 청구될 수 있습니다.</p>
                  <p>3. 사용 시간 초과 시 추가 요금이 발생합니다.</p>
                  <p>4. 퇴실 시 다음 이용자를 위해 깨끗하게 정리해주세요.</p>
                  <p>5. 분실물은 책임지지 않습니다.</p>
                  <br/>
                  <p><strong>[환불 규정]</strong></p>
                  <p>- 이용 예정일 7일 전까지 취소 시: 100% 환불</p>
                  <p>- 이용 예정일 5일 전까지 취소 시: 70% 환불</p>
                  <p>- 이용 예정일 3일 전까지 취소 시: 50% 환불</p>
                  <p>- 이용 예정일 2일 전 이내 취소 시: 환불 불가</p>
                  <br/>
                  <p>* 천재지변 등 불가항력적인 사유로 인한 취소는 협의 후 결정됩니다.</p>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="confirmRules"
                    checked={rulesConfirmed}
                    onChange={(e) => setRulesConfirmed(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="confirmRules" className="ml-2 block text-sm text-gray-900">
                    이용 규칙 및 환불 규정을 확인했으며 동의합니다.
                  </label>
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

                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    다음
                  </button>
                ) : ( // activeStep === 4
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!rulesConfirmed} // 체크박스가 체크되지 않으면 버튼 비활성화
                    className={`px-6 py-2 rounded-md ${rulesConfirmed ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    공간 등록 하기
                  </button>
                )}
              </div>
            )}
            {/* 단계 1 버튼은 유지 (activeStep === 1) */}
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
