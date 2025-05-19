package com.likelion.loco_project.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 로그인 요청 시 클라이언트로부터 받는 데이터를 담는 DTO
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDto {
    // 비어있거나 공백 문자열을 허용 안함 (@NotBlank)
    @NotBlank(message = "로그인 아이디는 필수입니다.")
    private String loginId; // 사용자 로그인 아이디 (이메일, 사용자 이름 등)

    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
}