export interface Review {
  id: number;
  guestId: number;
  spaceId: number;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReviewFormData {
  spaceId: number;
  rating: number;
  content: string;
}

export interface GuestRating {
  id: number;
  hostId: number;
  guestId: number;
  rating: number;
}

export interface GuestRatingFormData {
  guestId: number;
  rating: number;
}

export interface ReportFormData {
  reviewId: number;
  reason: string;
  detail: string;
}
