package com.likelion.loco_project.domain.guest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestRequestDto {
    private Long userId; // 어떤 유저를 게스트로 등록할 것인지
}