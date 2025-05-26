package com.likelion.loco_project.domain.review.controller;

import com.likelion.loco_project.domain.review.dto.ReviewRequestDto;
import com.likelion.loco_project.domain.review.dto.ReviewResponseDto;
import com.likelion.loco_project.domain.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/guest/reviews")
@RequiredArgsConstructor
@Slf4j // <- 로그 선언 추가
public class GuestReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewResponseDto createReview(@RequestBody ReviewRequestDto requestDto,
                                          @RequestParam Long guestId) {
        return reviewService.createReview(guestId, requestDto);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponseDto updateReview(@PathVariable Long reviewId,
                                          @RequestParam Long guestId,
                                          @RequestBody ReviewRequestDto requestDto) {
        return reviewService.updateReview(reviewId, guestId, requestDto);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId,
                             @RequestParam Long guestId) {
        reviewService.deleteReview(reviewId, guestId);
    }

    @GetMapping("/space/{spaceId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsBySpace(
            @PathVariable Long spaceId,
            @RequestParam(defaultValue = "latest") String sort
    ) {
        log.info("공간 {}에 대한 리뷰 조회 요청 - 정렬: {}", spaceId, sort);
        return ResponseEntity.ok(reviewService.getReviewsBySpace(spaceId, sort));
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByGuest(@PathVariable Long guestId) {
        log.info("게스트 {}의 리뷰 조회 요청", guestId);
        return ResponseEntity.ok(reviewService.getReviewsByGuest(guestId));
    }

}
