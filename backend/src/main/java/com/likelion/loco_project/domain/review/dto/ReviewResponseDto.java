package com.likelion.loco_project.domain.review.dto;

import com.likelion.loco_project.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponseDto {
    private Long id;
    private Long guestId;
    private Long spaceId;
    private int rating;
    private String content;

    public static ReviewResponseDto fromEntity(Review review) {
        return ReviewResponseDto.builder()
                .id(review.getId())
                .guestId(review.getGuestId())
                .spaceId(review.getSpaceId())
                .rating(review.getRating())
                .content(review.getContent())
                .build();
    }
}
