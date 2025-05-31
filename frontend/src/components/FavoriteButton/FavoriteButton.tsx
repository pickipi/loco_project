import { useState } from "react";
import api from "@/lib/axios";

interface FavoriteButtonProps {
  spaceId: number;
  isInitiallyFavorited: boolean;
}

export default function FavoriteButton({ spaceId, isInitiallyFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await api.delete(`/api/v1/spaces/${spaceId}/favorite`);
      } else {
        await api.post(`/api/v1/spaces/${spaceId}/favorite`);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      alert("찜하기에 실패했습니다.");
      console.error(err);
    }
  };

  return (
    <button onClick={toggleFavorite} aria-label="찜하기">
      {isFavorited ? "⭐ 찜함" : "☆ 찜하기"}
    </button>
  );
}