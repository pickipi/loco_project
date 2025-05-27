package com.likelion.loco_project.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String username; // 로그인 유지를 위한 사용자 이름 표시 필드
}
