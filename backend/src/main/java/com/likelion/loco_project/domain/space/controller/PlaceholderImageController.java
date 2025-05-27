package com.likelion.loco_project.domain.space.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/placeholder.svg")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Tag(name = "기본 이미지", description = "기본 이미지(placeholder) 관련 API")
public class PlaceholderImageController {

    @Operation(
        summary = "기본 이미지 조회",
        description = "이미지 로딩 실패 시 사용할 기본 이미지를 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "기본 이미지 조회 성공"),
            @ApiResponse(responseCode = "404", description = "기본 이미지를 찾을 수 없음")
        }
    )
    @GetMapping
    public ResponseEntity<Resource> getPlaceholderImage(
            @Parameter(description = "이미지 너비 (기본값: 300)", example = "300")
            @RequestParam(defaultValue = "300") int width,
            @Parameter(description = "이미지 높이 (기본값: 200)", example = "200")
            @RequestParam(defaultValue = "200") int height) {
        try {
            // 기본 placeholder 이미지 반환
            Resource resource = new ClassPathResource("static/images/placeholder.svg");
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("image/svg+xml"))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
