"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Camera, PartyPopper, Coffee, Upload } from "lucide-react"
import { ThemeToggle } from "../../components/ThemeToggle"

export default function RegisterSpacePage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState({
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
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, type }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 실제 API 호출
      // const response = await fetch('/api/v1/spaces', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // })

      // if (response.ok) {
      //   const data = await response.json()
      //   router.push(`/spaces/${data.id}`)
      // }

      // 임시 처리
      console.log("제출된 데이터:", formData)
      alert("공간이 성공적으로 등록되었습니다!")
      router.push("/spaces")
    } catch (error) {
      console.error("공간 등록 오류:", error)
    }
  }

  const nextStep = () => {
    setActiveStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setActiveStep((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-8">
      <ThemeToggle />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-8">공간 등록하기</h1>

          {/* 단계 표시 */}
          <div className="flex justify-between items-center mb-10">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                1
              </div>
              <span className="text-sm">기본 정보</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 2 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <span className="text-sm">공간 정보</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 3 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
              <span className="text-sm">이용 규칙</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 4 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 4 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 4 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                4
              </div>
              <span className="text-sm">완료</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 단계 1: 기본 정보 */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">공간 유형</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      type="button"
                      onClick={() => handleTypeSelect("회의실")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${formData.type === "회의실" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <Building2 className="w-6 h-6 mb-2 text-gray-600" />
                      <span>회의실</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect("스튜디오")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${formData.type === "스튜디오" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <Camera className="w-6 h-6 mb-2 text-gray-600" />
                      <span>스튜디오</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect("파티룸")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${formData.type === "파티룸" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <PartyPopper className="w-6 h-6 mb-2 text-gray-600" />
                      <span>파티룸</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect("오피스")}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${formData.type === "오피스" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <Coffee className="w-6 h-6 mb-2 text-gray-600" />
                      <span>오피스</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                  />
                  <p className="text-xs text-gray-500 mt-1">최소 20자 이상 작성해주세요</p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    위치 정보
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="우편번호"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                      주소 검색
                    </button>
                  </div>
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
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">공간 사진</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-1">여기를 클릭하거나 드래그하여 사진을 올려주세요</p>
                      <p className="text-xs text-gray-500">권장 크기: 1000x1000px / 최대 10장</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" multiple />
                  </div>
                </div>
              </div>
            )}

            {/* 단계 3: 이용 규칙 */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">예약 단위</label>
                  <div className="flex items-center">
                    <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2">
                      시간 단위
                    </button>
                    <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">
                      일 단위
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">운영 시간</label>
                  <div className="flex items-center gap-2">
                    <select
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">시작 시간</option>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {i.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                    <span>~</span>
                    <select
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">종료 시간</option>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {i.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">시간당 가격</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.price}
                      readOnly
                      className="w-40 px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <span>원</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">최소/최대 예약 시간</label>
                  <div className="flex items-center gap-2">
                    <select
                      name="minTime"
                      value={formData.minTime}
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
                      value={formData.maxTime}
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">수용 인원</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`최소 인원: 1명 ~ 최대 인원: ${formData.capacity}명`}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 단계 4: 완료 */}
            {activeStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold">공간 등록이 완료되었습니다!</h2>
                <p className="text-gray-600">
                  등록하신 공간은 관리자 승인 후 게시됩니다.
                  <br />
                  승인 결과는 이메일로 알려드립니다.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => router.push("/spaces")}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    공간 목록으로 이동
                  </button>
                </div>
              </div>
            )}

            {/* 버튼 영역 */}
            {activeStep < 4 && (
              <div className="flex justify-between mt-10">
                {activeStep > 1 ? (
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
                  type="button"
                  onClick={activeStep === 3 ? handleSubmit : nextStep}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {activeStep === 3 ? "등록 하기" : "다음"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
