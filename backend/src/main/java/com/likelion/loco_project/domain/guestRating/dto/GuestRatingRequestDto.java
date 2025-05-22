package com.likelion.loco_project.domain.guestRating.dto;

import lombok.Getter;

@Getter
public class GuestRatingRequestDto {
    private Long guestId;
    private int rating;
}
