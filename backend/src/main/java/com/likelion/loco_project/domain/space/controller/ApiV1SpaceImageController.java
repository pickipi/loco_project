package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.s3.S3Service;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces/images")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // 직접 origin 지정
@Tag(name = "공간의 이미지", description = "공간 이미지 관리 API")
public class ApiV1SpaceImageController {
    private final S3Service s3Service;

    @PostMapping("/upload")
    @Operation(summary = "이미지 업로드", description = "공간의 이미지를 업로드합니다.")
    public ResponseEntity<RsData<List<String>>> uploadImages(
            @RequestParam("files") List<MultipartFile> files) {
        List<String> imageUrls = new ArrayList<>();
        
        try {
            for (MultipartFile file : files) {
                // 파일 크기 검증 필요
                if (file.getSize() > MAX_FILE_SIZE) {
                    errors.add(file.getOriginalFilename() + ": 파일 크기가 5MB를 초과합니다.");
                    continue;
                }

                // 파일 타입 검증
                String contentType = file.getContentType();
                if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
                    errors.add(file.getOriginalFilename() + ": 지원하지 않는 이미지 형식입니다. (지원 형식: JPEG, PNG, GIF, WEBP)");
                    continue;
                }

                String imageUrl = s3Service.uploadFile(file);
                imageUrls.add(imageUrl);
            }
            return ResponseEntity.ok(RsData.of("S-1", "이미지 업로드 성공", imageUrls));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "이미지 업로드 실패: " + e.getMessage(), null));
        }
    }

    @DeleteMapping
    @Operation(summary = "이미지 삭제", description = "공간의 이미지를 삭제합니다.")
    public ResponseEntity<RsData<Void>> deleteImages(@RequestParam("urls") List<String> imageUrls) {
        try {
            for (String imageUrl : imageUrls) {
                s3Service.deleteFile(imageUrl);
            }
            return ResponseEntity.ok(RsData.of("S-1", "이미지 삭제 성공", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(RsData.of("F-1", "이미지 삭제 실패: " + e.getMessage(), null));
        }
    }
}
