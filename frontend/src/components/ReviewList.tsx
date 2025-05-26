import React from "react";
import { Review } from "@/types/review";
import RatingStars from "./RatingStars";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: number;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
  onReport?: (reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
  onReport,
}) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="font-medium">게스트 {review.guestId}</span>
              <RatingStars rating={review.rating} size={16} />
            </div>
            <div className="flex gap-2">
              {currentUserId === review.guestId && (
                <>
                  <button
                    onClick={() => onEdit?.(review)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete?.(review.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </>
              )}
              {currentUserId && currentUserId !== review.guestId && (
                <button
                  onClick={() => onReport?.(review.id)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  신고
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-gray-700">{review.content}</p>
          <p className="mt-2 text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
