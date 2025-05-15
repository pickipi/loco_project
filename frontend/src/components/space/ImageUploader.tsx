'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { IoMdClose } from 'react-icons/io'
import { IoAdd } from 'react-icons/io5'

// 이미지 업로더 컴포넌트의 Props 인터페이스
interface ImageUploaderProps {
  mainImage: File | null                       // 대표 이미지 파일
  additionalImages: File[]                     // 추가 이미지 파일 배열
  onMainImageUpload: (file: File | null) => void       // 대표 이미지 업로드 핸들러
  onAdditionalImagesUpload: (files: File[]) => void    // 추가 이미지 업로드 핸들러
  onMainImageDelete: () => void                        // 대표 이미지 삭제 핸들러
  onAdditionalImageDelete: (index: number) => void     // 추가 이미지 삭제 핸들러
}

export default function ImageUploader({
  mainImage,
  additionalImages,
  onMainImageUpload,
  onAdditionalImagesUpload,
  onMainImageDelete,
  onAdditionalImageDelete
}: ImageUploaderProps) {
  // 파일 입력을 위한 ref 생성
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const additionalImagesInputRef = useRef<HTMLInputElement>(null)

  // 이미지 업로드 처리 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = Array.from(e.target.files || [])
    
    if (isMain) {
      // 대표 이미지 업로드 처리
      const file = files[0]
      if (file) {
        // 파일 크기 제한 검사 (3MB)
        if (file.size > 3 * 1024 * 1024) {
          alert('이미지 크기는 3MB를 초과할 수 없습니다.')
          return
        }
        onMainImageUpload(file)
      }
    } else {
      // 추가 이미지 업로드 처리
      // 최대 10장 제한 검사
      if (files.length + additionalImages.length > 10) {
        alert('추가 이미지는 최대 10장까지 업로드 가능합니다.')
        return
      }
      // 파일 크기 제한 검사 (각 3MB)
      const validFiles = files.filter(file => file.size <= 3 * 1024 * 1024)
      if (validFiles.length !== files.length) {
        alert('일부 이미지가 3MB를 초과하여 제외되었습니다.')
      }
      onAdditionalImagesUpload(validFiles)
    }
  }

  return (
    <div className="space-y-4">
      {/* 대표 이미지 업로드 섹션 */}
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
        <input
          type="file"
          ref={mainImageInputRef}
          onChange={(e) => handleImageUpload(e, true)}
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
        />
        {mainImage ? (
          // 대표 이미지가 있는 경우 이미지 표시
          <div className="relative w-full h-48">
            <button
              type="button"
              onClick={onMainImageDelete}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
            >
              <IoMdClose size={20} />
            </button>
            <Image
              src={URL.createObjectURL(mainImage)}
              alt="대표 이미지"
              fill
              className="object-cover rounded"
            />
          </div>
        ) : (
          // 대표 이미지가 없는 경우 업로드 버튼 표시
          <button
            type="button"
            onClick={() => mainImageInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-12 text-gray-500 hover:text-[#7047EB]"
          >
            <div className="w-20 h-20 border-2 border-current rounded-full flex items-center justify-center mb-2">
              <IoAdd size={40} />
            </div>
            <p className="text-sm font-medium">대표 이미지 추가</p>
          </button>
        )}
      </div>

      {/* 추가 이미지 목록 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* 업로드된 추가 이미지 표시 */}
        {additionalImages.map((image, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-2 h-48">
            <button
              type="button"
              onClick={() => onAdditionalImageDelete(index)}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
            >
              <IoMdClose size={20} />
            </button>
            <Image
              src={URL.createObjectURL(image)}
              alt={`추가 이미지 ${index + 1}`}
              fill
              className="object-cover rounded"
            />
          </div>
        ))}

        {/* 추가 이미지 업로드 버튼 (10장 미만인 경우에만 표시) */}
        {additionalImages.length < 10 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-48">
            <input
              type="file"
              ref={additionalImagesInputRef}
              onChange={(e) => handleImageUpload(e)}
              accept="image/jpeg,image/jpg,image/png"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => additionalImagesInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-[#7047EB]"
            >
              <div className="w-16 h-16 border-2 border-current rounded-full flex items-center justify-center mb-2">
                <IoAdd size={32} />
              </div>
              <p className="text-sm font-medium">추가 이미지 ({additionalImages.length}/10)</p>
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 