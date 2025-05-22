package com.likelion.loco_project.domain.review.controller;

import com.likelion.loco_project.domain.review.dto.ReviewRequestDto;
import com.likelion.loco_project.domain.review.dto.ReviewResponseDto;
import com.likelion.loco_project.domain.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/guest/reviews")
@RequiredArgsConstructor
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
    public List<ReviewResponseDto> getReviewsBySpace(@PathVariable Long spaceId) {
        return reviewService.getReviewsForSpace(spaceId);
    }
}
