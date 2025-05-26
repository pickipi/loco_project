package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.*;
import com.likelion.loco_project.domain.space.service.SpaceService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // 직접 origin 지정
public class ApiV1SpaceController {

    private final SpaceService spaceService;

    // 공간 생성
    @Operation(summary = "공간 생성", description = "새로운 공간을 등록합니다.")
    @PostMapping("/{hostId}/register")
    public ResponseEntity<SpaceResponseDto> createSpace(
            @PathVariable("hostId") Long hostId,
            @RequestBody SpaceCreateRequestDto dto) {
        try {
            SpaceResponseDto response = spaceService.createSpace(hostId, dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("공간 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 공간 단건 조회(지도)
    @Operation(summary = "공간 단건 조회", description = "공간 ID로 단일 공간 정보를 조회합니다. (지도에서 사용)")
    @GetMapping("/{id}")
    public ResponseEntity<RsData<SpaceResponseDto>> getSpace(@PathVariable Long id) {
        SpaceResponseDto dto = spaceService.getSpace(id);
        return ResponseEntity.ok(RsData.of("S-200", "공간 조회 성공", dto));
    }

    // 모든 공간 목록 조회
    @Operation(summary = "모든 공간 목록 조회", description = "등록된 모든 공간의 목록을 조회합니다.")
    @GetMapping("/all")
    public ResponseEntity<RsData<Page<SpaceListResponseDto>>> getAllSpaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sort));
        Page<SpaceListResponseDto> spaces = spaceService.getAllSpacesWithPagination(pageRequest);
        return ResponseEntity.ok(RsData.of("S-1", "모든 공간 목록을 조회했습니다.", spaces));
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

    // 공간 이미지 추가
    @PostMapping("/{id}/images")
    @Operation(summary = "공간 이미지 추가", description = "공간에 이미지를 추가합니다.")
    public ResponseEntity<RsData<SpaceResponseDto>> addSpaceImages(
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
