package com.likelion.loco_project.domain.guest.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestResponseDto {
    private Long id;
    private BigDecimal guestRating;
    private Long userId;
    private String userName;
}