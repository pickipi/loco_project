import { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

interface FavoriteButtonProps {
  spaceId: number;
  isInitiallyFavorited: boolean;
}

export default function FavoriteButton({ spaceId, isInitiallyFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await axios.delete(`${API_BASE_URL}/api/v1/spaces/${spaceId}/favorite`);
      } else {
        await axios.post(`${API_BASE_URL}/api/v1/spaces/${spaceId}/favorite`);
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