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
}: SpaceCardProps) {
  return (
    <Link href={`/spaces/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48">
          <Image
            src={imageUrl || "/default-space.jpg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            quality={85}
            style={{ objectFit: "cover" }}
            className="transition-transform duration-200 hover:scale-105"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">{location}</p>
          <p className="text-gray-600 text-sm mb-2">최대 {capacity}명</p>

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
