import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 10,
  size = 20,
  color = "#FFD700",
}) => {
  const stars = [];
  const normalizedRating = rating / 2; // 10점 만점을 5점 만점으로 변환 (5개의 별로 표시)

  for (let i = 1; i <= 5; i++) {
    if (normalizedRating >= i) {
      stars.push(<FaStar key={i} size={size} color={color} />);
    } else if (normalizedRating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color={color} />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color={color} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-2 text-sm text-gray-600">
        ({rating}/{maxRating})
      </span>
    </div>
  );
};

export default RatingStars;
