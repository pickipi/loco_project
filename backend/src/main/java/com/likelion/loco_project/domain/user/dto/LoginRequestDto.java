package com.likelion.loco_project.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

// 로그인 요청 시 클라이언트로부터 받는 데이터를 담는 DTO
@Getter
@Setter
public class LoginRequestDto {
    private String email;
    private String password;
}