package com.likelion.loco_project.domain.admin.controller;

import com.likelion.loco_project.domain.admin.dto.UpdateRoleRequestDto;
import com.likelion.loco_project.domain.user.dto.UserResponseDto;
import com.likelion.loco_project.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "관리자 - 사용자 관리", description = "사용자 권한 관리 API")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminUserController {
    private final UserService userService;

    @Operation(summary = "전체 사용자 조회", description = "모든 사용자의 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "사용자 권한 변경", description = "특정 사용자의 권한을 변경합니다.")
    @PatchMapping("/{userId}/role")
    public ResponseEntity<UserResponseDto> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UpdateRoleRequestDto request) {
        return ResponseEntity.ok(userService.updateUserRole(userId, request.getRole()));
    }
}
