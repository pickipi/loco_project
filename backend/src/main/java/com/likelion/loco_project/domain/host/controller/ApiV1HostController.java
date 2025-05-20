package com.likelion.loco_project.domain.host.controller;

import com.likelion.loco_project.domain.user.dto.UserRequestDto;
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

    // 호스트 등록 API (POST /api/v1/hosts/{userId})
    @Operation(summary = "호스트 등록", description = "특정 유저 ID로 호스트를 등록합니다.")
    @PostMapping("/{userId}")
    public ResponseEntity<HostResponseDto> register(@Parameter(description = "등록할 유저 ID", example = "1")
    @PathVariable("userId") Long userId,
                                                    @RequestBody HostRequestDto requestDto) {
        return ResponseEntity.ok(hostService.registerHost(userId, requestDto));
    }

    // 호스트 정보 조회 API (GET /api/v1/hosts/{userId})
    @GetMapping("/{userId}")
    public ResponseEntity<HostResponseDto> getHost(@PathVariable Long userId) {
        return ResponseEntity.ok(hostService.getHostInfo(userId));
    }

    //호스트 페이지에서 바로 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDto dto) {
        hostService.registerHost(dto);
        return ResponseEntity.ok("호스트 회원가입 완료");
    }
}
