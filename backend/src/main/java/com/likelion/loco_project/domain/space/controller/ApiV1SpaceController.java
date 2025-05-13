package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.SpaceCreateRequestDto;
import com.likelion.loco_project.domain.space.dto.SpaceResponseDto;
import com.likelion.loco_project.domain.space.dto.SpaceUpdateRequestDto;
import com.likelion.loco_project.domain.space.service.SpaceService;
import com.likelion.loco_project.global.rsData.RsData;
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
    @PostMapping
    public ResponseEntity<SpaceResponseDto> createSpace(@RequestBody SpaceCreateRequestDto dto) {
        SpaceResponseDto response = spaceService.createSpace(dto);
        return ResponseEntity.ok(response);
    }

    // 공간 단건 조회(지도)
    @GetMapping("/{id}")
    public ResponseEntity<RsData<SpaceResponseDto>> getSpace(@PathVariable Long id) {
        SpaceResponseDto dto = spaceService.getSpace(id);
        return ResponseEntity.ok(RsData.of("S-200", "공간 조회 성공", dto));
    }

    // 공간 전체 조회(지도)
    @GetMapping
    public ResponseEntity<List<SpaceResponseDto>> getAllSpaces() {
        List<SpaceResponseDto> response = spaceService.getAllSpaces();
        return ResponseEntity.ok(response);
    }

    // 공간 수정
    @PutMapping("/{id}/edit")
    public ResponseEntity<SpaceResponseDto> updateSpace(@PathVariable Long id,
                                                        @RequestBody SpaceUpdateRequestDto dto) {
        SpaceResponseDto response = spaceService.updateSpace(id, dto);
        return ResponseEntity.ok(response);
    }

    // 공간 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        spaceService.deleteSpace(id);
        return ResponseEntity.noContent().build();
    }
}