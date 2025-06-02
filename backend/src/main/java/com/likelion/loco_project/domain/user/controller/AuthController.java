package com.likelion.loco_project.domain.user.controller;

import com.likelion.loco_project.domain.host.service.HostService;
import com.likelion.loco_project.domain.user.dto.LoginRequestDto;
import com.likelion.loco_project.domain.user.dto.LoginResponseDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.service.UserService;
import com.likelion.loco_project.global.jwt.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "인증", description = "로그인/로그아웃 관련 API")
public class AuthController {
    private final UserService userService;
    private final HostService hostService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto req) {
        // 1) 사용자 인증
        User user = userService.loginAndValidate(req.getEmail(), req.getPassword());

        // 2) 호스트 여부 확인
        boolean isHost = hostService.isHost(user.getId());

        // 3) 토큰 발급 (role 클레임 포함)
        String token = jwtTokenProvider.generateAccessToken(
                user.getId(),
                isHost ? "HOST" : "GUEST"
        );

        // 4) 응답에 userId와 role 포함
        LoginResponseDto resDto = new LoginResponseDto(
                token,
                "로그인 완료!",
                user.getId(),
                user.getUsername(),
                isHost ? "HOST" : "GUEST"
        );
        return ResponseEntity.ok(resDto);
    }
}