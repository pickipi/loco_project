package com.likelion.loco_project.domain.user.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;

@Getter
public class PasswordResetRequestDto {
    @Email(message = "유효한 이메일을 입력하세요.")
    private String email;
}