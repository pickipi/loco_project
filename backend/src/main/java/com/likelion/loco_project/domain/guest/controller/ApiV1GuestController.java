package com.likelion.loco_project.domain.guest.controller;

import com.likelion.loco_project.domain.guest.dto.GuestRequestDto;
import com.likelion.loco_project.domain.guest.dto.GuestResponseDto;
import com.likelion.loco_project.domain.guest.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/guests")
@RequiredArgsConstructor
@Tag(name = "게스트", description = "게스트 관련 API, 게스트 등록 / 조회")
public class ApiV1GuestController {
    private final GuestService guestService;

    @Operation(summary = "게스트 생성", description = "새로운 게스트를 생성합니다.")
    @PostMapping
    public ResponseEntity<GuestResponseDto> createGuest(@RequestBody GuestRequestDto dto) {
        GuestResponseDto created = guestService.createGuest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "특정 게스트 조회", description = "특정 게스트를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<GuestResponseDto> getGuest(@PathVariable Long id) {
        return ResponseEntity.ok(guestService.getGuest(id));
    }
}