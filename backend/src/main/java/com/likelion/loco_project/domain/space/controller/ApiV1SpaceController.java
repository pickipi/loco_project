package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.*;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.service.SpaceService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
            @AuthenticationPrincipal Long hostId,
            @RequestBody SpaceCreateRequestDto spaceCreateRequestDto) {
        try {
            SpaceResponseDto response = spaceService.createSpace(hostId, spaceCreateRequestDto);
            return ResponseEntity.ok(RsData.of("S-1", "공간 등록 성공", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "공간 등록 중 오류가 발생했습니다: " + e.getMessage(), null));
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
            @PathVariable("id") Long id) {
        SpaceResponseDto dto = spaceService.getSpace(id);
        return ResponseEntity.ok(RsData.of("S-200", "공간 조회 성공", dto));
    }

//    // 모든 공간 목록 조회
//    @Operation(summary = "모든 공간 조회 (페이징)", description = "모든 공간을 페이지 단위로 조회합니다.")
//    @GetMapping("/all")
//    public RsData<Page<SpaceResponseDto>> getAllSpaces(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "12") int size,
//            @RequestParam(defaultValue = "id,desc") String sort
//    ) {
//        // 1) sort 파싱
//        String[] parts = sort.split(",");
//        String sortBy = parts[0];
//        Sort.Direction direction = Sort.Direction.fromString(parts.length > 1 ? parts[1] : "asc");
//
//        // 2) Pageable 생성
//        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
//
//        // 3) 엔티티 Page<Space> 가져오기
//        Page<Space> spaces = spaceService.getAllSpacesWithPagination(pageable);
//
//        // 4) DTO 로 매핑 (SpaceListResponseDto.from)
//        Page<SpaceResponseDto> dtoPage = spaces.map(SpaceResponseDto::fromEntity);
//        return RsData.of("S-1", "조회 성공", dtoPage);
//    }

    @GetMapping("/all")
    public Page<SpaceListResponseDto> getAllSpaces(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return spaceService.getAllSpacesWithPagination(pageable);
    }

//    @GetMapping("/api/v1/spaces/all")
//    public Page<SpaceListResponseDto> getAllSpaces(
//            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable
//    ) {
//        Page<Space> spaces = spaceService.getAllSpacesWithPagination(pageable);
//        return spaces.map(SpaceListResponseDto::from);
//    }

//    @GetMapping("/api/v1/spaces/all")
//    public Page<SpaceListResponseDto> getAllSpacesWithPagination(
//            @RequestParam(name = "page",  defaultValue = "0") int page,
//            @RequestParam(name = "size",  defaultValue = "12") int size,
//            @RequestParam(name = "sort",  defaultValue = "id,desc") String sort
//    ) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by(
//                Sort.Order.by(sort.split(",")[0])
//                        .with(sort.split(",")[1].equalsIgnoreCase("desc")
//                                ? Sort.Direction.DESC : Sort.Direction.ASC)
//        ));
//        return spaceService.getAllSpacesWithPagination(pageable);
//    }


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
    public ResponseEntity<Page<SpaceResponseDto>> searchSpaces(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) List<String> spaceTypes,
            @RequestParam(required = false) List<String> facilities,
            @RequestParam(required = false, defaultValue = "id") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        SpaceSearchDto searchDto = new SpaceSearchDto();
        searchDto.setLocation(location);
        searchDto.setMinPrice(minPrice);
        searchDto.setMaxPrice(maxPrice);
        searchDto.setCapacity(capacity);
        searchDto.setSpaceTypes(spaceTypes);
        searchDto.setFacilities(facilities);
        searchDto.setSortBy(sortBy);
        searchDto.setSortDirection(sortDirection);
        searchDto.setPage(page);
        searchDto.setSize(size);
        
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

    // 호스트별 공간 목록 조회 추가
    @GetMapping("/my-spaces")
    @Operation(summary = "내 공간 목록 조회", description = "로그인한 호스트의 공간 목록을 조회합니다.")
    public ResponseEntity<RsData<Page<SpaceResponseDto>>> getMySpaces(
            @AuthenticationPrincipal Long hostId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "id,desc") String sort) {

        String[] parts = sort.split(",");
        String sortBy = parts[0];
        Sort.Direction direction = Sort.Direction.fromString(parts.length > 1 ? parts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        try {
            Page<SpaceResponseDto> spaces = spaceService.getSpacesByHostId(hostId, pageable);
            return ResponseEntity.ok(RsData.of("S-1", "내 공간 목록 조회 성공", spaces));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "내 공간 목록 조회 중 오류가 발생했습니다: " + e.getMessage(), null));
        }
    }
}
