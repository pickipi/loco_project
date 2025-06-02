import Image from "next/image";
import Link from "next/link";

export interface SpaceCardProps {
  id: string;
  title: string;
  location: string;
  capacity: string;
  price: number;
  rating: number;
  imageUrl: string;
  reviewCount?: number;
  description: string;
  category: string;
}

export default function SpaceCard({
  id,
  title,
  location,
  capacity,
  price,
  rating,
  imageUrl,
  reviewCount = 0,
  description,
  category,
}: SpaceCardProps) {
  // imageUrl이 null이면 기본 이미지, 아니면 S3 URL 사용
  const src = imageUrl
    ? imageUrl.startsWith('http')    // 이미 전체 URL이면 그대로 사용
      ? imageUrl
      : `https://loco-project-s3-image.s3.ap-northeast-2.amazonaws.com/${imageUrl}`  // S3 URL 생성
    : '/placeholder.svg';     // 기본 플레이스홀더 경로 변경

  return (
    <Link href={`/spaces/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-[#40322F] text-white px-2 py-1 rounded text-sm">
            {category}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="ml-1 text-gray-500 text-sm">
                  ({reviewCount})
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">{location}</p>
          <p className="text-gray-600 text-sm mb-2">최대 {capacity}명</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

          <div className="flex justify-between items-center mt-4">
            <p className="text-[#40322F] font-semibold">
              ₩{price.toLocaleString()}
              <span className="text-sm text-gray-600">/시간</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
