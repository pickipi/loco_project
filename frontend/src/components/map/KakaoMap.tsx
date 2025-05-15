'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

/**
 * 카카오맵 API의 전역 타입 선언
 * window 객체에 kakao 프로퍼티를 추가하여 TypeScript에서 인식할 수 있도록 함
 */
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;  // 카카오맵 로드 함수
        Map: new (container: HTMLElement, options: any) => any;  // 지도 생성 클래스
        LatLng: new (lat: number, lng: number) => any;  // 위경도 좌표 클래스
        Marker: new (options: any) => any;  // 지도 마커 클래스
        services: {
          Geocoder: new () => {  // 주소-좌표 변환 서비스
            addressSearch: (
              address: string,
              callback: (result: any[], status: any) => void
            ) => void;
          };
          Status: {
            OK: string;  // API 응답 상태 코드
          };
        };
      };
    };
  }
}

/**
 * KakaoMap 컴포넌트 Props 인터페이스
 * @property address - 검색할 주소
 * @property center - 지도 중심 좌표 (위도, 경도)
 * @property onLocationChange - 위치 변경 시 호출될 콜백 함수
 */
interface KakaoMapProps {
  address: string
  center: {
    lat: number
    lng: number
  }
  onLocationChange: (lat: number, lng: number) => void
}

/**
 * 카카오맵 컴포넌트
 * 주소 검색 및 지도 표시 기능을 제공
 */
export default function KakaoMap({ address, center, onLocationChange }: KakaoMapProps) {
  // 지도를 표시할 DOM 요소 참조
  const mapRef = useRef<HTMLDivElement>(null)
  // 지도 인스턴스 참조 (지도 조작에 사용)
  const mapInstanceRef = useRef<any>(null)
  // 마커 인스턴스 참조 (마커 위치 변경에 사용)
  const markerRef = useRef<any>(null)

  /**
   * 카카오맵 초기화 함수
   * 지도와 마커를 생성하고 초기 위치에 배치
   */
  const initializeMap = () => {
    if (!mapRef.current) return

    // 지도 생성 옵션
    const options = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),  // 지도 중심 좌표
      level: 3  // 지도 확대 레벨 (1~14, 작을수록 확대)
    }

    // 지도 생성
    const map = new window.kakao.maps.Map(mapRef.current, options)
    mapInstanceRef.current = map

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(center.lat, center.lng),
      map: map
    })
    markerRef.current = marker
  }

  /**
   * 주소로 위치 검색하는 함수
   * @param address - 검색할 주소
   */
  const searchAddress = (address: string) => {
    if (!window.kakao || !mapInstanceRef.current) return

    // 주소-좌표 변환 객체 생성
    const geocoder = new window.kakao.maps.services.Geocoder()
    
    // 주소로 좌표 검색
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
        
        // 지도 중심을 검색된 위치로 이동
        mapInstanceRef.current.setCenter(coords)
        
        // 마커를 검색된 위치로 이동
        markerRef.current.setPosition(coords)
        
        // 검색된 위치 정보를 부모 컴포넌트에 전달
        onLocationChange(coords.getLat(), coords.getLng())
      } else {
        alert('주소를 찾을 수 없습니다. 다시 시도해주세요.')
      }
    })
  }

  /**
   * 주소가 변경될 때마다 위치 검색 실행
   */
  useEffect(() => {
    if (address && window.kakao) {
      searchAddress(address)
    }
  }, [address])

  /**
   * 카카오맵 SDK 로드 완료 후 실행될 콜백
   */
  const handleMapLoad = () => {
    window.kakao.maps.load(() => {
      initializeMap()
    })
  }

  return (
    <>
      {/* 카카오맵 SDK 스크립트 로드 */}
      <Script
        strategy="beforeInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
      />
      {/* 지도가 표시될 컨테이너 */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
} 