"use client";

import { useRef, useState, DragEvent } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { IoAdd } from "react-icons/io5";

// 이미지 업로더 컴포넌트의 Props 인터페이스
interface ImageUploaderProps {
  mainImage: File | null; // 대표 이미지 파일
  additionalImages: File[]; // 추가 이미지 파일 배열
  onMainImageUpload: (file: File | null) => void; // 대표 이미지 업로드 핸들러
  onAdditionalImagesUpload: (files: File[]) => void; // 추가 이미지 업로드 핸들러
  onMainImageDelete: () => void; // 대표 이미지 삭제 핸들러
  onAdditionalImageDelete: (index: number) => void; // 추가 이미지 삭제 핸들러
}

export default function ImageUploader({
  mainImage,
  additionalImages,
  onMainImageUpload,
  onAdditionalImagesUpload,
  onMainImageDelete,
  onAdditionalImageDelete,
}: ImageUploaderProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 이미지 업로드 처리 함수
  const handleImageUpload = (files: File[], isMain: boolean = false) => {
    if (isMain) {
      const file = files[0];
      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          alert("이미지 크기는 3MB를 초과할 수 없습니다.");
          return;
        }
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드 가능합니다.");
          return;
        }
        onMainImageUpload(file);
      }
    } else {
      if (files.length + additionalImages.length > 10) {
        alert("추가 이미지는 최대 10장까지 업로드 가능합니다.");
        return;
      }
      const validFiles = files.filter((file) => {
        if (file.size > 3 * 1024 * 1024) {
          return false;
        }
        if (!file.type.startsWith("image/")) {
          return false;
        }
        return true;
      });
      if (validFiles.length !== files.length) {
        alert("일부 파일이 제외되었습니다. (3MB 초과 또는 이미지 파일이 아님)");
      }
      if (validFiles.length > 0) {
        onAdditionalImagesUpload(validFiles);
      }
    }
  };

  // 파일 입력 변경 핸들러
  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMain: boolean = false
  ) => {
    const files = Array.from(e.target.files || []);
    handleImageUpload(files, isMain);
    // 파일 입력값 초기화 (같은 파일 다시 선택 가능하도록)
    e.target.value = "";
  };

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent, isMain: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files, isMain);
  };

  return (
    <div className="space-y-4">
      {/* 대표 이미지 업로드 섹션 */}
      <div
        className={`relative border-2 border-dashed ${
          isDragging ? "border-[#7047EB] bg-[#7047EB]/5" : "border-gray-300"
        } rounded-lg p-4 transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, true)}
      >
        <input
          type="file"
          ref={mainImageInputRef}
          onChange={(e) => handleFileInputChange(e, true)}
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
            className="w-full flex flex-col items-center justify-center py-12 text-gray-500 hover:text-[#7047EB]"
          >
            <div className="w-20 h-20 border-2 border-current rounded-full flex items-center justify-center mb-2">
              <IoAdd size={40} />
            </div>
            <p className="text-sm font-medium">대표 이미지 추가</p>
            <p className="text-xs text-gray-400 mt-1">
              클릭하거나 이미지를 드래그하여 업로드하세요
            </p>
          </button>
        )}
      </div>

      {/* 추가 이미지 목록 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* 업로드된 추가 이미지 표시 */}
        {additionalImages.map((image, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-lg p-2 h-48"
          >
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

        {/* 추가 이미지 업로드 영역 */}
        {additionalImages.length < 10 && (
          <div
            className={`border-2 border-dashed ${
              isDragging ? "border-[#7047EB] bg-[#7047EB]/5" : "border-gray-300"
            } rounded-lg h-48 transition-colors`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={additionalImagesInputRef}
              onChange={(e) => handleFileInputChange(e)}
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
              <p className="text-sm font-medium">
                추가 이미지 ({additionalImages.length}/10)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                클릭하거나 이미지를 드래그하여 업로드하세요
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
