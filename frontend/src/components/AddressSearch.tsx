"use client";

import { useState } from "react";
import DaumPostcode from "./DaumPostcode";

interface AddressSearchProps {
  onComplete: (data: {
    address: string;
    zonecode: string;
    buildingName?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  buttonClassName?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function AddressSearch({
  onComplete,
  buttonClassName,
}: AddressSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleComplete = async (data: any) => {
    const { roadAddress, address, zonecode, buildingName } = data;
    const selectedAddress = roadAddress || address;

    // Kakao Maps SDK가 로드되어 있는지 확인
    if (window.kakao?.maps?.services) {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(
        selectedAddress,
        (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = {
              latitude: Number(result[0].y),
              longitude: Number(result[0].x),
            };

            onComplete({
              address: selectedAddress,
              zonecode,
              buildingName,
              ...coords,
            });
          } else {
            console.warn("Geocoding failed:", status);
            onComplete({
              address: selectedAddress,
              zonecode,
              buildingName,
            });
          }
        }
      );
    } else {
      // Kakao Maps SDK가 로드되지 않은 경우
      console.warn("Kakao Maps SDK not loaded");
      onComplete({
        address: selectedAddress,
        zonecode,
        buildingName,
      });
    }

    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          buttonClassName ||
          "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        }
      >
        주소 검색
      </button>
      {isOpen && (
        <DaumPostcode
          onComplete={handleComplete}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
