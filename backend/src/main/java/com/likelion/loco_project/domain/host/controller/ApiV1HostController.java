package com.likelion.loco_project.domain.host.controller;

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
    @PostMapping("/{userId}")
    public ResponseEntity<HostResponseDto> register(@PathVariable Long userId,
                                                    @RequestBody HostRequestDto requestDto) {
        return ResponseEntity.ok(hostService.registerHost(userId, requestDto));
    }

    // 호스트 정보 조회 API (GET /api/v1/hosts/{userId})
    @GetMapping("/{userId}")
    public ResponseEntity<HostResponseDto> getHost(@PathVariable Long userId) {
        return ResponseEntity.ok(hostService.getHostInfo(userId));
    }

}
