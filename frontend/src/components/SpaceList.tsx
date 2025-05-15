"use client";

interface Space {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface SpaceListProps {
  selectedSpace: string;
  onSelect: (spaceId: string) => void;
}

const SPACES: Space[] = [
  {
    id: "space1",
    name: "회의실 A",
    price: 50000,
    image: "/images/meeting-room.jpg",
    description: "최대 10명 수용 가능한 회의실",
  },
  {
    id: "space2",
    name: "스터디룸 B",
    price: 30000,
    image: "/images/study-room.jpg",
    description: "조용한 분위기의 스터디룸",
  },
  {
    id: "space3",
    name: "연습실 C",
    price: 40000,
    image: "/images/practice-room.jpg",
    description: "음악 연습을 위한 공간",
  },
];

export default function SpaceList({ selectedSpace, onSelect }: SpaceListProps) {
  return (
    <div className="space-y-4">
      {SPACES.map((space) => (
        <div
          key={space.id}
          onClick={() => onSelect(space.id)}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectedSpace === space.id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-500"
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
              {/* 이미지가 있다면 여기에 표시 */}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{space.name}</h3>
              <p className="text-gray-600">{space.description}</p>
              <p className="text-blue-600 font-medium mt-2">
                {space.price.toLocaleString()}원/시간
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
