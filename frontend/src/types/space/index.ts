export interface SpaceCreateRequestDto {
    spaceName: string;
    spaceType: string;
    description: string;
    address: string;
    price: number;
    maxCapacity: number;
    openTime: string; // 시간 형식에 맞게 수정 필요
    closeTime: string; // 시간 형식에 맞게 수정 필요
    minTime: number;
    maxTime: number;
    imageUrls: string[];
    // 필요한 경우 추가 필드 정의
}

// 필요한 경우 다른 공간 관련 타입 정의 추가 