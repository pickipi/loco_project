package com.likelion.loco_project.domain.user.dto;

import lombok.Getter;

@Getter
public class LoginResponseDto { // 로그인에 성공했을 때 반환되는 DTO
    private String token;
    private String message;
    private Long userId;
    private String username;  // 사용자 이름 추가
    private String role;     // "USER" or "HOST"

    // 생성자
    public LoginResponseDto(String token, String message, Long userId, String username, String role) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.username = username;
        this.role = role;
    }
    // getters
}
