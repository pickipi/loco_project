package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.SpaceCreateRequestDto;
import com.likelion.loco_project.domain.space.dto.SpaceResponseDto;
import com.likelion.loco_project.domain.space.dto.SpaceSearchDto;
import com.likelion.loco_project.domain.space.dto.SpaceUpdateRequestDto;
import com.likelion.loco_project.domain.space.service.SpaceService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces")
public class ApiV1SpaceController {

    private final SpaceService spaceService;

    // 공간 생성
    @Operation(summary = "공간 생성", description = "새로운 공간을 등록합니다.")
    @PostMapping("/me/register")
    public ResponseEntity<SpaceResponseDto> createSpace(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody SpaceCreateRequestDto dto) {
        Long hostId = Long.parseLong(userDetails.getUsername()); // 로그인 유저 ID
        return ResponseEntity.ok(spaceService.createSpace(hostId, dto));
    }

    // 공간 단건 조회(지도)
    @Operation(summary = "공간 단건 조회", description = "공간 ID로 단일 공간 정보를 조회합니다. (지도에서 사용)")
    @GetMapping("/{id}")
    public ResponseEntity<RsData<SpaceResponseDto>> getSpace(@PathVariable Long id) {
        SpaceResponseDto dto = spaceService.getSpace(id);
        return ResponseEntity.ok(RsData.of("S-200", "공간 조회 성공", dto));
    }

    // 공간 전체 조회(지도)
    @Operation(summary = "전체 공간 목록 조회", description = "등록된 모든 공간 리스트를 조회합니다. (지도에서 사용)")
    @GetMapping
    public ResponseEntity<List<SpaceResponseDto>> getAllSpaces() {
        List<SpaceResponseDto> response = spaceService.getAllSpaces();
        return ResponseEntity.ok(response);
    }

    // 공간 수정
    @Operation(summary = "공간 정보 수정", description = "공간 ID에 해당하는 공간의 정보를 수정합니다.")
    @PutMapping("/{id}/edit")
    public ResponseEntity<SpaceResponseDto> updateSpace(@PathVariable Long id,
                                                        @RequestBody SpaceUpdateRequestDto dto) {
        SpaceResponseDto response = spaceService.updateSpace(id, dto);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<Page<SpaceResponseDto>> searchSpaces(SpaceSearchDto searchDto) {
        return ResponseEntity.ok(spaceService.searchSpaces(searchDto));
    }
}