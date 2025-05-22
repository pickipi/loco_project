package com.likelion.loco_project.domain.host.controller;

import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.dto.LoginRequestDto;
import com.likelion.loco_project.domain.user.dto.LoginResponseDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.service.UserService;
import com.likelion.loco_project.global.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.likelion.loco_project.domain.host.dto.HostRequestDto;
import com.likelion.loco_project.domain.host.dto.HostResponseDto;
import com.likelion.loco_project.domain.host.service.HostService;

@RestController
@RequestMapping("/api/v1/hosts")
@RequiredArgsConstructor
public class ApiV1HostController {

    private final HostService hostService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    // 호스트 등록 API (POST /api/v1/hosts/{userId})
    @Operation(summary = "호스트 등록", description = "특정 유저 ID로 호스트를 등록합니다.")
    @PostMapping("/{userId}")
    public ResponseEntity<HostResponseDto> register(@Parameter(description = "등록할 유저 ID", example = "1")
    @PathVariable("userId") Long userId,
                                                    @RequestBody HostRequestDto requestDto) {
        return ResponseEntity.ok(hostService.registerHost(userId, requestDto));
    }

    // 호스트 정보 조회 API (GET /api/v1/hosts/{userId})
    @Operation(summary = "호스트 정보 조회", description = "특정 유저 ID로 호스트 정보를 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<HostResponseDto> getHost(@PathVariable Long userId) {
        return ResponseEntity.ok(hostService.getHostInfo(userId));
    }

    //호스트 페이지에서 바로 회원가입
    @Operation(summary = "호스트 회원가입", description = "호스트 페이지에서 직접 회원가입을 진행합니다.")
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDto dto) {
        hostService.registerHost(dto);
        return ResponseEntity.ok("호스트 회원가입 완료");
    }

    @Operation(summary = "호스트 로그인", description = "이메일과 비밀번호로 호스트 로그인을 합니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        User user = userService.loginAndValidate(loginRequest.getEmail(), loginRequest.getPassword());
        // 호스트 여부 확인
        if (!hostService.isHost(user.getId())) {
            throw new IllegalArgumentException("호스트 계정이 아닙니다.");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}
