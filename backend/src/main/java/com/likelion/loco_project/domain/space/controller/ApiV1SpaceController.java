package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.SpaceCreateRequestDto;
import com.likelion.loco_project.domain.space.dto.SpaceResponseDto;
import com.likelion.loco_project.domain.space.dto.SpaceUpdateRequestDto;
import com.likelion.loco_project.domain.space.service.SpaceService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces")
public class ApiV1SpaceController {

    private final SpaceService spaceService;

    // 공간 생성
    @Operation(summary = "공간 생성"
            , description = "새로운 공간을 등록합니다.")
    @PostMapping
    public ResponseEntity<SpaceResponseDto> createSpace(@RequestBody SpaceCreateRequestDto dto) {
        SpaceResponseDto response = spaceService.createSpace(dto);
        return ResponseEntity.ok(response);
    }

    // 공간 단건 조회(지도)
    @Operation(summary = "공간 단건 조회"
            , description = "공간 ID로 단일 공간 정보를 조회합니다. (지도에서 사용)")
    @GetMapping("/{id}")
    public ResponseEntity<RsData<SpaceResponseDto>> getSpace(@PathVariable Long id) {
        SpaceResponseDto dto = spaceService.getSpace(id);
        return ResponseEntity.ok(RsData.of("S-200", "공간 조회 성공", dto));
    }

    // 공간 전체 조회(지도)
    @Operation(summary = "전체 공간 목록 조회"
            , description = "등록된 모든 공간 리스트를 조회합니다. (지도에서 사용)")
    @GetMapping
    public ResponseEntity<List<SpaceResponseDto>> getAllSpaces() {
        List<SpaceResponseDto> response = spaceService.getAllSpaces();
        return ResponseEntity.ok(response);
    }

    // 공간 수정
    @Operation(summary = "공간 정보 수정"
            , description = "공간 ID에 해당하는 공간의 정보를 수정합니다.")
    @PutMapping("/{id}/edit")
    public ResponseEntity<SpaceResponseDto> updateSpace(@PathVariable Long id,
                                                        @RequestBody SpaceUpdateRequestDto dto) {
        SpaceResponseDto response = spaceService.updateSpace(id, dto);
        return ResponseEntity.ok(response);
    }

    // 공간 삭제
    @Operation(summary = "공간 삭제"
            , description = "공간 ID에 해당하는 공간을 삭제합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        spaceService.deleteSpace(id);
        return ResponseEntity.noContent().build();
    }
}