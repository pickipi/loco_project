package com.likelion.loco_project.domain.review.entity;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.space.entity.Space;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 작성자: 게스트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    // 사용 공간
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", nullable = false)
    private Space space;

    // 평점 (1~10)
    @Column(nullable = false)
    private int rating;

    // 리뷰 본문
    @Column(length = 500)
    private String content;

    @Builder.Default
    private boolean isDeleted = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateReview(int rating, String content) {
        this.rating = rating;
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.isDeleted = true;
    }
}
