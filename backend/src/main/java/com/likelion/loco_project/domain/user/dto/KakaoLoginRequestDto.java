package com.likelion.loco_project.domain.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KakaoLoginRequestDto {
    private String nickname;  // 카카오 닉네임
    private String email;     // 카카오 이메일
    private String userType;  // "GUEST" or "HOST"
} 