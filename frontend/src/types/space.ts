export interface SpaceListResponseDto {
  id: number;
  spaceName: string;
  spaceType: string; // 또는 'MEETING', 'STUDIO' 등 유니온 타입
  price: number; // 백엔드 Long에 맞춰 number로 가정
  address: string;
  maxCapacity: number; // 백엔드 Integer에 맞춰 number로 가정
  spaceRating: number; // 백엔드 BigDecimal에 맞춰 number로 가정
  isActive: boolean; // 공간 활성화 여부 추가
  imageUrl?: string; // 대표 이미지 URL
} 