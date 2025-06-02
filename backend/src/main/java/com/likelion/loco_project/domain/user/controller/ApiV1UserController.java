package com.likelion.loco_project.domain.user.controller;

import com.likelion.loco_project.domain.auth.EmailAuthManager;
import com.likelion.loco_project.domain.host.dto.HostRequestDto;
import com.likelion.loco_project.domain.host.service.HostService;
import com.likelion.loco_project.domain.user.dto.*;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.entity.UserType;
import com.likelion.loco_project.domain.user.service.UserService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "유저", description = "유저 관련 API")
public class ApiV1UserController {
    private final UserService userService;
    private final EmailAuthManager emailAuthManager;
    private final HostService hostService;

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @PostMapping
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRequestDto dto) {
        UserResponseDto createdUser = userService.createUser(dto);
        return ResponseEntity.ok(createdUser);
    }

    @Operation(summary = "게스트 회원가입", description = "새로운 게스트(GUEST) 계정을 등록합니다.")
    @PostMapping("/guest")
    public ResponseEntity<UserResponseDto> registerGuest(@RequestBody UserRequestDto dto) {
        // 강제로 userType을 GUEST로 설정
        dto.setUserType(UserType.GUEST.name());
        return registerUser(dto);
    }

    @Operation(summary = "호스트 회원가입", description = "새로운 호스트(HOST) 계정을 등록합니다.")
    @PostMapping("/host")
    public ResponseEntity<UserResponseDto> registerHost(@RequestBody UserRequestDto dto) {
        // 강제로 HOST 타입 지정
        dto.setUserType(UserType.HOST.name());

        // 1. 유저 생성
        UserResponseDto user = registerUser(dto).getBody();

        // 2. HostRequestDto 기본값으로 준비
        HostRequestDto hostDto = HostRequestDto.builder()
                .verified(false)  // 기본적으로 미인증 상태
                .bankName("")     // 빈 문자열로 초기화
                .accountNumber("") // 빈 문자열로 초기화
                .accountUser("")   // 빈 문자열로 초기화
                .registration(java.time.LocalDateTime.now()) // 현재 시간으로 설정
                .build();

        // 3. 호스트 엔티티 등록
        hostService.registerHost(user.getId(), hostDto);

        return ResponseEntity.ok(user);
    }

    @Operation(summary = "사용자 정보 조회", description = "사용자 ID로 특정 사용자의 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable(name = "id") Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
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

    //유저 알림 기능 끄기(채팅, 예약상태 선택 가능)
    @Operation(summary = "유저 알림 기능 끄기", description = "유저 알림 기능 끄기(채팅, 예약상태 선택가능)")
    @PutMapping("/me/notifications/toggle")
    public ResponseEntity<RsData<Boolean>> toggleNotification(@AuthenticationPrincipal User user) {
        boolean updated = userService.toggleNotification(user.getId());
        return ResponseEntity.ok(RsData.of("S-1", "알림 설정이 변경되었습니다.", updated));
    }

    // 유저 알림 상태 조회
    @Operation(summary = "유저 알림 상태 조회", description = "유저 알림 상태 조회")
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

    // 게스트용
    @PostMapping("/guests/forgot-password")
    public ResponseEntity<RsData<String>> resetGuestPassword(
            @RequestBody @Valid PasswordResetRequestDto dto
    ) {
        emailAuthManager.resetPasswordByEmail(dto.getEmail(), UserType.GUEST);
        return ResponseEntity.ok(RsData.of("S-1", "임시 비밀번호가 이메일로 전송되었습니다.", null));
    }

    // 호스트용
    @PostMapping("/hosts/forgot-password")
    public ResponseEntity<RsData<String>> resetHostPassword(
            @RequestBody @Valid PasswordResetRequestDto dto
    ) {
        emailAuthManager.resetPasswordByEmail(dto.getEmail(), UserType.HOST);
        return ResponseEntity.ok(RsData.of("S-1", "임시 비밀번호가 이메일로 전송되었습니다.", null));
    }

    //이미지
    @Operation(summary = "프로필 이미지 업데이트", description = "사용자의 프로필 이미지를 업데이트합니다.")
    @PutMapping("/{userId}/profile-image")
    public ResponseEntity<RsData<UserProfileResponseDto>> updateProfileImage(
            @PathVariable Long userId,
            @RequestBody UserProfileImageUpdateRequestDto request
    ) {
        UserProfileResponseDto dto = userService.updateProfileImage(userId, request.getImageUrl());
        return ResponseEntity.ok(RsData.of("S-1", "프로필 이미지가 업데이트되었습니다.", dto));
    }
}