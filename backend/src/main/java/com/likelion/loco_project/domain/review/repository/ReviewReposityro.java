package com.likelion.loco_project.domain.review.repository;

import com.likelion.loco_project.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllBySpaceId(Long spaceId); // 특정 공간에 작성된 모든 리뷰 조회
    List<Review> findAllByGuestId(Long guestId); // 특정 게스트가 작성한 리뷰 목록 조회
}
