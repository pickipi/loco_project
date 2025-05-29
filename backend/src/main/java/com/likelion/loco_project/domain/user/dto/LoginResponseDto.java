package com.likelion.loco_project.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class LoginResponseDto {
    private String token;
    private String message;
    private Long userId;
    private String role;     // "USER" or "HOST"

    // 생성자
    public LoginResponseDto(String token, String message, Long userId, String role) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.role = role;
    }
    // getters
}
