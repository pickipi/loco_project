import Image from "next/image";
import Link from "next/link";
import { SpaceListResponseDto } from "@/types/space";

export default function SpaceCard({
  id,
  spaceName,
  address,
  maxCapacity,
  price,
  spaceRating,
  imageUrl,
}: SpaceListResponseDto) {
  // 백엔드 이미지 경로를 프론트엔드에서 접근 가능한 URL로 변환
  const backendImageUrl = imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${imageUrl}` : "/default-space.jpg";

  return (
    <Link href={`/spaces/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48">
          <Image
            src={backendImageUrl}
            alt={spaceName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{spaceName}</h3>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-600">{spaceRating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">{address}</p>
          <p className="text-gray-600 text-sm mb-2">최대 {maxCapacity}명</p>

          <div className="flex justify-between items-center mt-4">
            <p className="text-blue-600 font-semibold">
              ₩{price.toLocaleString()}
              <span className="text-sm text-gray-600">/시간</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
