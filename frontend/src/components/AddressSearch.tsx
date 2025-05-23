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
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(
      data.roadAddress || data.address,
      (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = {
            latitude: Number(result[0].y),
            longitude: Number(result[0].x),
          };

          onComplete({
            address: data.roadAddress || data.address,
            zonecode: data.zonecode,
            buildingName: data.buildingName,
            ...coords,
          });
        } else {
          onComplete({
            address: data.roadAddress || data.address,
            zonecode: data.zonecode,
            buildingName: data.buildingName,
          });
        }
      }
    );

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
