package com.likelion.loco_project.domain.review.service;

import com.likelion.loco_project.domain.review.dto.ReviewRequestDto;
import com.likelion.loco_project.domain.review.dto.ReviewResponseDto;
import com.likelion.loco_project.domain.review.entity.Review;
import com.likelion.loco_project.domain.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewResponseDto createReview(Long guestId, ReviewRequestDto requestDto) {
        Review review = Review.builder()
                //.guestId(guestId)
                //.spaceId(requestDto.getSpaceId())
                .rating(requestDto.getRating())
                .content(requestDto.getContent())
                .build();
        reviewRepository.save(review);
        //return ReviewResponseDto.fromEntity(review);
        return null;
    }

    public ReviewResponseDto updateReview(Long reviewId, Long guestId, ReviewRequestDto requestDto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

//        if (!review.getGuestId().equals(guestId)) {
//            throw new SecurityException("작성자만 수정할 수 있습니다.");
//        }

//        review.update(requestDto.getRating(), requestDto.getContent());
//        return ReviewResponseDto.fromEntity(review);
        return null;
    }

    public void deleteReview(Long reviewId, Long guestId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
//        if (!review.getGuestId().equals(guestId)) {
//            throw new SecurityException("작성자만 삭제할 수 있습니다.");
//        }
        reviewRepository.delete(review);
    }

    public List<ReviewResponseDto> getReviewsForSpace(Long spaceId) {
//        return reviewRepository.findAllBySpaceId(spaceId).stream()
//                .map(ReviewResponseDto::fromEntity)
//                .collect(Collectors.toList());
        return null;
    }

    //공간 리뷰 필터링
    public List<ReviewResponseDto> getReviewsBySpace(Long spaceId, String sort) {

    List<Review> reviews;

    switch (sort.toLowerCase()) {
        case "rating-desc":     //평점 높은 순
            reviews = reviewRepository.findBySpaceIdAndIsDeletedFalseOrderByRatingDesc(spaceId);
            break;
        case "rating-asc":      //평점 낮은 순
            reviews = reviewRepository.findBySpaceIdAndIsDeletedFalseOrderByRatingAsc(spaceId);
            break;
        case "latest":          //평점 최신 순
        default:                //기본 평점 작성 순
            reviews = reviewRepository.findBySpaceIdAndIsDeletedFalseOrderByCreatedAtDesc(spaceId);
        }

    return reviews.stream()
            .map(ReviewResponseDto::from)
            .collect(Collectors.toList());
    }

    //게스트 평점
    public List<ReviewResponseDto> getReviewsByGuest(Long guestId) {
        return reviewRepository.findByGuestIdAndIsDeletedFalse(guestId)
                .stream()
                .map(ReviewResponseDto::from)
                .collect(Collectors.toList());
    }

}
