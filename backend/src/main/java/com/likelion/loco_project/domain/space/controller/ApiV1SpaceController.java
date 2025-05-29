package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.*;
import com.likelion.loco_project.domain.space.service.SpaceService;
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
            SpaceResponseDto response = spaceService.createSpace(hostId, dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("공간 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 공간 단건 조회(지도)
    @Operation(
        summary = "공간 단건 조회",
        description = "공간 ID로 단일 공간 정보를 조회합니다. (지도에서 사용)",
        responses = {
            @ApiResponse(responseCode = "200", description = "공간 조회 성공"),
            @ApiResponse(responseCode = "404", description = "공간을 찾을 수 없음")
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<RsData<SpaceResponseDto>> getSpace(
            @Parameter(description = "조회할 공간 ID", required = true, example = "1")
            @PathVariable Long id) {
        SpaceResponseDto dto = spaceService.getSpace(id);
        return ResponseEntity.ok(RsData.of("S-200", "공간 조회 성공", dto));
    }

    // 모든 공간 목록 조회
    @Operation(
        summary = "모든 공간 목록 조회",
        description = "등록된 모든 공간의 목록을 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "공간 목록 조회 성공")
        }
    )
    @GetMapping("/all")
    public ResponseEntity<RsData<Page<SpaceListResponseDto>>> getAllSpaces(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지당 항목 수", example = "12")
            @RequestParam(defaultValue = "12") int size,
            @Parameter(description = "정렬 기준 필드", example = "id")
            @RequestParam(defaultValue = "id") String sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sort));
        Page<SpaceListResponseDto> spaces = spaceService.getAllSpacesWithPagination(pageRequest);
        return ResponseEntity.ok(RsData.of("S-1", "모든 공간 목록을 조회했습니다.", spaces));
    }

    // 공간 수정
    @Operation(summary = "공간 정보 수정", description = "공간 ID에 해당하는 공간의 정보를 수정합니다.")
    @PutMapping("/{id}/edit")
    public ResponseEntity<RsData<SpaceResponseDto>> updateSpace(@PathVariable Long id,
                                                            @RequestBody SpaceUpdateRequestDto dto) {
        SpaceResponseDto response = spaceService.updateSpace(id, dto);
        
        StringBuilder message = new StringBuilder("공간 수정 완료!\n변경된 내용:\n");
        
        if (dto.getSpaceName() != null) {
            message.append(String.format("- 공간명: %s\n", dto.getSpaceName()));
        }
        if (dto.getSpaceType() != null) {
            message.append(String.format("- 공간 유형: %s\n", dto.getSpaceType()));
        }
        if (dto.getPrice() != null) {
            message.append(String.format("- 가격: %d원\n", dto.getPrice()));
        }
        if (dto.getMaxCapacity() != null) {
            message.append(String.format("- 최대 수용 인원: %d명\n", dto.getMaxCapacity()));
        }
        if (dto.getAddress() != null) {
            message.append(String.format("- 주소: %s\n", dto.getAddress()));
        }
        
        return ResponseEntity.ok(RsData.of("S-1", message.toString(), response));
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
