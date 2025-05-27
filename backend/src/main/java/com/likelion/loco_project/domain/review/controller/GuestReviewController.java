package com.likelion.loco_project.domain.review.controller;

import com.likelion.loco_project.domain.review.dto.ReviewRequestDto;
import com.likelion.loco_project.domain.review.dto.ReviewResponseDto;
import com.likelion.loco_project.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/guest/reviews")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "게스트 리뷰", description = "게스트 리뷰 관련 API")
public class GuestReviewController {

    private final ReviewService reviewService;

    @Operation(
        summary = "리뷰 작성",
        description = "게스트가 새로운 리뷰를 작성합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "리뷰 작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
        }
    )
    @PostMapping
    public ReviewResponseDto createReview(
            @Parameter(description = "리뷰 정보", required = true)
            @RequestBody ReviewRequestDto requestDto,
            @Parameter(description = "리뷰 작성자 ID", required = true)
            @RequestParam Long guestId) {
        return reviewService.createReview(guestId, requestDto);
    }

    @Operation(
        summary = "리뷰 수정",
        description = "게스트가 작성한 리뷰를 수정합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "리뷰 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
        }
    )
    @PutMapping("/{reviewId}")
    public ReviewResponseDto updateReview(
            @Parameter(description = "수정할 리뷰 ID", required = true)
            @PathVariable Long reviewId,
            @Parameter(description = "리뷰 작성자 ID", required = true)
            @RequestParam Long guestId,
            @Parameter(description = "수정할 리뷰 정보", required = true)
            @RequestBody ReviewRequestDto requestDto) {
        return reviewService.updateReview(reviewId, guestId, requestDto);
    }

    @Operation(
        summary = "리뷰 삭제",
        description = "게스트가 작성한 리뷰를 삭제합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
        }
    )
    @DeleteMapping("/{reviewId}")
    public void deleteReview(
            @Parameter(description = "삭제할 리뷰 ID", required = true)
            @PathVariable Long reviewId,
            @Parameter(description = "리뷰 작성자 ID", required = true)
            @RequestParam Long guestId) {
        reviewService.deleteReview(reviewId, guestId);
    }

    @Operation(
        summary = "공간별 리뷰 조회",
        description = "특정 공간의 리뷰 목록을 조회합니다. 정렬 기준을 지정할 수 있습니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "리뷰 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "공간을 찾을 수 없음")
        }
    )
    @GetMapping("/space/{spaceId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsBySpace(
            @Parameter(description = "리뷰를 조회할 공간 ID", required = true)
            @PathVariable Long spaceId,
            @Parameter(description = "정렬 기준 (latest: 최신순, rating-desc: 평점 높은순, rating-asc: 평점 낮은순)", example = "latest")
            @RequestParam(defaultValue = "latest") String sort) {
        log.info("공간 {}에 대한 리뷰 조회 요청 - 정렬: {}", spaceId, sort);
        return ResponseEntity.ok(reviewService.getReviewsBySpace(spaceId, sort));
    }

    @Operation(
        summary = "게스트별 리뷰 조회",
        description = "특정 게스트가 작성한 리뷰 목록을 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "리뷰 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게스트를 찾을 수 없음")
        }
    )
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByGuest(
            @Parameter(description = "리뷰를 조회할 게스트 ID", required = true)
            @PathVariable Long guestId) {
        log.info("게스트 {}의 리뷰 조회 요청", guestId);
        return ResponseEntity.ok(reviewService.getReviewsByGuest(guestId));
    }
}
