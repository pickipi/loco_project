'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    kakao: any
  }
}

interface KakaoMapProps {
  address: string
  center: {
    lat: number
    lng: number
  }
  onLocationChange: (lat: number, lng: number) => void
  placeName?: string
}

export default function KakaoMap({ address, center, onLocationChange, placeName = '선택한 위치' }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)

  const initializeMap = () => {
    if (!mapRef.current) return
    
    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: 3,
    })
    mapInstanceRef.current = map

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(center.lat, center.lng),
      map,
    })
    markerRef.current = marker

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div style="width:150px;text-align:center;padding:6px 0;">${placeName}</div>`,
      removable: true,
    })
    infoWindowRef.current = infoWindow
    infoWindow.open(map, marker)
  }

  const searchAddress = (searchText: string) => {
    if (!mapInstanceRef.current) return

    const ps = new window.kakao.maps.services.Places()
    
    ps.keywordSearch(searchText, (places: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = places[0]
        const coords = new window.kakao.maps.LatLng(place.y, place.x)
        
        markerRef.current.setPosition(coords)
        mapInstanceRef.current.setCenter(coords)

        if (infoWindowRef.current) {
          infoWindowRef.current.close()
          infoWindowRef.current.setContent(`
            <div style="width:200px;text-align:center;padding:6px 0;">
              <div>${place.place_name}</div>
            </div>
          `)
          infoWindowRef.current.open(mapInstanceRef.current, markerRef.current)
        }

        onLocationChange(parseFloat(place.y), parseFloat(place.x))
      }
    })
  }

  useEffect(() => {
    if (!window.kakao?.maps) return
    window.kakao.maps.load(() => {
      initializeMap()
      if (address) {
        searchAddress(address)
      }
    })
  }, [address])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        onLoad={() => window.kakao.maps.load(initializeMap)}
      />
      <div ref={mapRef} style={{ width: '100%', height: '300px' }} />
    </>
  )
}