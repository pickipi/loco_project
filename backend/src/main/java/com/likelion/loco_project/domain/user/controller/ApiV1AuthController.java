package com.likelion.loco_project.domain.user.controller;

import com.likelion.loco_project.domain.user.dto.KakaoLoginRequestDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.service.KakaoAuthService;
import com.likelion.loco_project.domain.user.service.UserService;
import com.likelion.loco_project.global.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class ApiV1AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final KakaoAuthService kakaoAuthService;

    @Operation(summary = "카카오 로그인 콜백", description = "카카오 OAuth 인증 후 콜백을 처리합니다.")
    @PostMapping("/kakao/callback")
    public ResponseEntity<Map<String, String>> kakaoCallback(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        
        // 1. 카카오 액세스 토큰 받기
        String accessToken = kakaoAuthService.getAccessToken(code);
        
        // 2. 카카오 사용자 정보 받기
        KakaoAuthService.KakaoUserInfo kakaoUserInfo = kakaoAuthService.getKakaoUserInfo(accessToken);
        
        // 3. 기존 사용자 확인
        Optional<User> existingUser = userService.findByEmail(kakaoUserInfo.getEmail());
        
        User user;
        if (existingUser.isPresent()) {
            // 기존 사용자가 있으면 그대로 사용
            user = existingUser.get();
        } else {
            // 새 사용자 생성
            KakaoLoginRequestDto kakaoUser = KakaoLoginRequestDto.builder()
                    .nickname(kakaoUserInfo.getNickname())
                    .email(kakaoUserInfo.getEmail())
                    .userType("GUEST")
                    .build();
            
            user = userService.createKakaoUser(kakaoUser);
        }
        
        // 4. JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getEmail());
        
        return ResponseEntity.ok(Map.of("token", token));
    }
} 