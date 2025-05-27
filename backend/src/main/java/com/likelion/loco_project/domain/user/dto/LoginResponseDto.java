package com.likelion.loco_project.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String message;
    private Long hostId;
}
