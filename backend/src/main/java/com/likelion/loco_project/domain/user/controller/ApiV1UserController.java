package com.likelion.loco_project.domain.user.controller;

import com.likelion.loco_project.domain.user.dto.LoginRequestDto;
import com.likelion.loco_project.domain.user.dto.LoginResponseDto;
import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.dto.UserResponseDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.service.UserService;
import com.likelion.loco_project.global.jwt.JwtUtil;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ApiV1UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @PostMapping
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRequestDto dto) {
        UserResponseDto createdUser = userService.createUser(dto);
        return ResponseEntity.ok(createdUser);
    }

    @Operation(summary = "사용자 정보 조회", description = "사용자 ID로 특정 사용자의 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable(name = "id") Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    //    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
//    @PostMapping("/login")
//    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
//        UserResponseDto user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
//        return ResponseEntity.ok(user);
//    }
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        User user = userService.loginAndValidate(loginRequest.getEmail(), loginRequest.getPassword());
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    @Operation(summary = "사용자 정보 수정", description = "기존 사용자의 정보를 수정합니다.")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable(name = "id") Long id,
            @RequestBody UserRequestDto dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @Operation(summary = "사용자 삭제", description = "사용자 ID로 특정 사용자를 완전히 삭제합니다.")
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDeleteUser(@PathVariable(name = "id") Long id) {
        userService.hardDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    //유저 알림 기능 끄기(채팅, 예약상태 선택가능)
    @PutMapping("/me/notifications/toggle")
    public ResponseEntity<RsData<Boolean>> toggleNotification(@AuthenticationPrincipal User user) {
        boolean updated = userService.toggleNotification(user.getId());
        return ResponseEntity.ok(RsData.of("S-1", "알림 설정이 변경되었습니다.", updated));
    }

    // 유저 알림 상태 조회
    @GetMapping("/me/notifications/enabled")
    public ResponseEntity<RsData<Boolean>> isNotificationEnabled(@AuthenticationPrincipal User user) {
        boolean enabled = userService.isNotificationEnabled(user.getId());
        return ResponseEntity.ok(RsData.of("S-1", "알림 설정 상태 조회 성공", enabled));
    }

    // 이메일 인증 코드 전송
    @Operation(summary = "이메일 인증 코드 전송", description = "사용자 이메일로 인증 코드를 전송합니다.")
    @PostMapping("/emails/verification-requests")
    public ResponseEntity<Void> sendVerificationCode(@RequestParam("email") String email) {
        userService.sendCodeToEmail(email);
        return ResponseEntity.ok().build();
    }

    //이메일 인증 코드 검증
    @Operation(summary = "이메일 인증 코드 검증", description = "사용자가 입력한 인증 코드를 검증합니다.")
    @GetMapping("/emails/verifications")
    public ResponseEntity<RsData<Boolean>> verifyCode(
            @RequestParam("email") String email,
            @RequestParam("code") String code
    ) {
        boolean verified = userService.verifyCode(email, code);
        return ResponseEntity.ok(RsData.of("S-1", "이메일 인증 결과", verified));
    }
}