package com.likelion.loco_project.domain.review.dto;

import com.likelion.loco_project.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewResponseDto {

    private Long reviewId;
    private Long guestId;
    private Long spaceId;
    private int rating;
    private String content;
    private LocalDateTime createdAt;

    public static ReviewResponseDto from(Review review) {
        return ReviewResponseDto.builder()
                .reviewId(review.getId())
                .guestId(review.getGuest().getId())
                .spaceId(review.getSpace().getId())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
