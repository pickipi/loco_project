package com.likelion.loco_project.domain.guestRating.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GuestRatingResponseDto {
    private Long ratingId;
    private String message;
}
