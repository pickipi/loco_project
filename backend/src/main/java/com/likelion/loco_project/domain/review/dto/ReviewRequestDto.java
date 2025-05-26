package com.likelion.loco_project.domain.review.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewRequestDto {
    private Long spaceId;
    private int rating; // 1~10점 자연수
    private String content;
}