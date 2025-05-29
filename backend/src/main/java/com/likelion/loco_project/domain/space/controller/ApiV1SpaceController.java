package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.*;
import com.likelion.loco_project.domain.space.service.SpaceService;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // 직접 origin 지정
@Tag(name = "공간", description = "공간 관련 API")
public class ApiV1SpaceController {

    private final SpaceService spaceService;

    // 공간 등록
    @PostMapping
    @Operation(summary = "공간 등록", description = "새로운 공간을 등록합니다.")
    public ResponseEntity<RsData<SpaceResponseDto>> createSpace(
            @RequestBody SpaceCreateRequestDto spaceCreateRequestDto) {
        try {
            SpaceResponseDto response = spaceService.createSpace(spaceCreateRequestDto);
            return ResponseEntity.ok(RsData.of("S-1", "공간 등록 성공", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "공간 등록 실패: " + e.getMessage(), null));
        }
    }

    // 공간 단건 조회(지도)
    @GetMapping("/{id}")
    @Operation(summary = "공간 조회", description = "특정 공간의 정보를 조회합니다.")
    public ResponseEntity<RsData<SpaceResponseDto>> getSpace(@PathVariable Long id) {
        try {
            SpaceResponseDto response = spaceService.getSpace(id);
            return ResponseEntity.ok(RsData.of("S-1", "공간 조회 성공", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "공간 조회 실패: " + e.getMessage(), null));
        }
    }

    // 모든 공간 목록 조회
    @GetMapping
    @Operation(summary = "공간 목록 조회", description = "모든 공간의 목록을 조회합니다.")
    public ResponseEntity<RsData<Page<SpaceListResponseDto>>> getAllSpaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<SpaceListResponseDto> response = spaceService.getAllSpacesWithPagination(
                org.springframework.data.domain.PageRequest.of(page, size));
            return ResponseEntity.ok(RsData.of("S-1", "공간 목록 조회 성공", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "공간 목록 조회 실패: " + e.getMessage(), null));
        }
    }

    // 공간 수정
    @PutMapping("/{id}")
    @Operation(summary = "공간 수정", description = "기존 공간의 정보를 수정합니다.")
    public ResponseEntity<RsData<SpaceResponseDto>> updateSpace(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody SpaceUpdateRequestDto dto) {
        try {
            SpaceResponseDto response = spaceService.updateSpace(id, dto);
            return ResponseEntity.ok(RsData.of("S-1", "공간 수정 성공", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "공간 수정 실패: " + e.getMessage(), null));
        }
    }

    // 공간 삭제
    @Operation(summary = "공간 삭제", description = "공간 ID에 해당하는 공간을 삭제합니다.")
    @ApiResponse(responseCode = "204", description = "삭제 성공")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable("id") Long id) {
        spaceService.deleteSpace(id);
        return ResponseEntity.noContent().build();
    }

    // 공간 검색
    @GetMapping("/search")
    @Operation(summary = "공간 검색", description = "조건에 맞는 공간을 검색합니다.")
    public ResponseEntity<RsData<Page<SpaceResponseDto>>> searchSpaces(SpaceSearchDto searchDto) {
        try {
            Page<SpaceResponseDto> response = spaceService.searchSpaces(searchDto);
            return ResponseEntity.ok(RsData.of("S-1", "공간 검색 성공", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "공간 검색 실패: " + e.getMessage(), null));
        }
    }

    // 공간 이미지 추가
    @PostMapping("/{id}/images")
    @Operation(summary = "공간 이미지 추가", description = "공간에 이미지를 추가합니다.")
    public ResponseEntity<RsData<SpaceResponseDto>> addSpaceImages(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam List<String> imageUrls) {
        try {
            SpaceResponseDto response = spaceService.addSpaceImages(id, imageUrls);
            return ResponseEntity.ok(RsData.of("S-1", "이미지 추가 성공", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "이미지 추가 실패: " + e.getMessage(), null));
        }
    }
}
