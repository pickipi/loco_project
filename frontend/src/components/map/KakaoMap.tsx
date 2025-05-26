// 클라이언트 사이드에서만 실행되도록 지정
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// 카카오맵 타입을 전역 Window 객체에 추가
declare global {
  interface Window {
    kakao: any;
  }
}

// 컴포넌트 Props 인터페이스 정의
interface KakaoMapProps {
  address: string; // 검색할 주소
  center: {
    // 지도 초기 중심 좌표
    lat: number; // 위도
    lng: number; // 경도
  };
  onLocationChange: (lat: number, lng: number) => void; // 위치 변경 시 호출될 콜백 함수
  onAddressChange?: (address: string) => void; // 주소 변경 시 호출될 콜백 함수
  placeName?: string; // 마커에 표시될 장소 이름 (기본값: '선택한 위치')
  shouldSearch?: boolean; // 주소 검색 여부 (기본값: false)
}

export default function KakaoMap({
  address,
  center,
  onLocationChange,
  onAddressChange,
  placeName = "선택한 위치",
  shouldSearch = false,
}: KakaoMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isAddressSearchVisible, setIsAddressSearchVisible] = useState(false);
  // DOM 요소와 카카오맵 인스턴스를 참조하기 위한 ref 선언
  const mapRef = useRef<HTMLDivElement>(null); // 지도가 표시될 div 요소
  const mapInstanceRef = useRef<any>(null); // 카카오맵 인스턴스
  const markerRef = useRef<any>(null); // 지도 마커 인스턴스
  const infoWindowRef = useRef<any>(null); // 인포윈도우 인스턴스
  const geocoderRef = useRef<any>(null); // Geocoder 인스턴스

  // 카카오맵 초기화 함수
  const initializeMap = () => {
    if (!mapRef.current || !window.kakao?.maps) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: 3,
    });
    mapInstanceRef.current = map;

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(center.lat, center.lng),
      map,
    });
    markerRef.current = marker;

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div style="width:250px;text-align:center;padding:10px;font-size:14px;background:#fff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);">${placeName}</div>`,
      removable: true,
    });
    infoWindowRef.current = infoWindow;
    infoWindow.open(map, marker);

    // Geocoder 서비스 초기화
    geocoderRef.current = new window.kakao.maps.services.Geocoder();

    // 초기 위치의 주소 가져오기
    const initialCoords = marker.getPosition();
    if (geocoderRef.current) {
      geocoderRef.current.coord2Address(
        initialCoords.getLng(),
        initialCoords.getLat(),
        (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const addr = result[0];
            const address = addr.road_address
              ? addr.road_address.address_name
              : addr.address.address_name;

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`
                <div style="width:250px;text-align:center;padding:10px;font-size:14px;background:#fff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
                  <div>${address}</div>
                </div>
              `);
            }
          }
        }
      );
    }
  };

  // 주소 검색 함수
  const searchAddress = (searchText: string) => {
    if (!mapInstanceRef.current || !shouldSearch) return; // shouldSearch가 true일 때만 검색 실행

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(searchText, (places: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = places[0];
        const coords = new window.kakao.maps.LatLng(place.y, place.x);

        markerRef.current.setPosition(coords);
        mapInstanceRef.current.setCenter(coords);

        // Geocoder로 정확한 주소 가져오기
        if (geocoderRef.current) {
          geocoderRef.current.coord2Address(
            coords.getLng(),
            coords.getLat(),
            (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const addr = result[0];
                const address = addr.road_address
                  ? addr.road_address.address_name
                  : addr.address.address_name;

                if (infoWindowRef.current) {
                  infoWindowRef.current.setContent(`
                  <div style="width:250px;text-align:center;padding:10px;font-size:14px;background:#fff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
                    <div>${address}</div>
                  </div>
                `);
                }
              }
            }
          );
        }

        onLocationChange(parseFloat(place.y), parseFloat(place.x));
      }
    });
  };

  // 주소 검색 결과 처리
  const handleAddressSelect = (data: any) => {
    if (!mapInstanceRef.current || !geocoderRef.current) return;

    const selectedAddress = data.address;
    if (onAddressChange) {
      onAddressChange(selectedAddress);
    }

    // 선택된 주소로 지도 위치 변경
    geocoderRef.current.addressSearch(
      selectedAddress,
      (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          mapInstanceRef.current.setCenter(coords);
          if (markerRef.current) {
            markerRef.current.setPosition(coords);
          }

          onLocationChange(result[0].y, result[0].x);
        }
      }
    );

    setIsAddressSearchVisible(false);
  };
  // 카카오맵 로드 및 초기화를 위한 useEffect
  useEffect(() => {
    let isMapScriptLoaded = false;

    const loadKakaoMap = () => {
      if (
        typeof window.kakao === "undefined" ||
        typeof window.kakao.maps === "undefined"
      ) {
        return;
      }
      if (!isMapScriptLoaded) {
        window.kakao.maps.load(() => {
          isMapScriptLoaded = true;
          initializeMap();
          if (address && shouldSearch) {
            searchAddress(address);
          }
        });
      } else {
        initializeMap();
        if (address && shouldSearch) {
          searchAddress(address);
        }
      }
    };

    if (mapLoaded) {
      loadKakaoMap();
    }

    return () => {
      isMapScriptLoaded = false;
    };
  }, [mapLoaded, shouldSearch, address]);

  return (
    <div className="relative w-full h-full">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`}
        onLoad={() => setMapLoaded(true)}
      />
      <div
        ref={mapRef}
        className="w-full h-[300px] rounded-lg overflow-hidden"
      />

      <button
        type="button"
        onClick={() => setIsAddressSearchVisible(true)}
        className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-50"
      >
        주소 검색
      </button>

      {isAddressSearchVisible && (
        <div className="absolute inset-0 z-20 bg-white">
          <div id="addressSearch" className="w-full h-full" />
          <button
            type="button"
            onClick={() => setIsAddressSearchVisible(false)}
            className="absolute top-4 right-4 z-30 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
