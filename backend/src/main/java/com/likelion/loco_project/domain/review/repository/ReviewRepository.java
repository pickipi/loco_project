package com.likelion.loco_project.domain.review.repository;

import com.likelion.loco_project.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllBySpaceId(Long spaceId); // 특정 공간에 작성된 모든 리뷰 조회
    List<Review> findAllByGuestId(Long guestId); // 특정 게스트가 작성한 리뷰 목록 조회

    // 공간 기준
    List<Review> findBySpaceIdAndIsDeletedFalse(Long spaceId);

    // 게스트 기준
    List<Review> findByGuestIdAndIsDeletedFalse(Long guestId);

    // 평점 높은 순
    List<Review> findBySpaceIdAndIsDeletedFalseOrderByRatingDesc(Long spaceId);

    // 평점 낮은 순
    List<Review> findBySpaceIdAndIsDeletedFalseOrderByRatingAsc(Long spaceId);

    // 최신순 정렬
    List<Review> findBySpaceIdAndIsDeletedFalseOrderByCreatedAtDesc(Long spaceId);

    // 전체 (관리자 등)
    List<Review> findAllByIsDeletedFalse();
}
