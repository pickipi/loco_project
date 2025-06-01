package com.likelion.loco_project.domain.space.entity;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "spaces")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Space extends BaseEntity {

    @Column(name = "space_name", length = 100, nullable = false)
    private String spaceName; // 공간 이름

    @Column(columnDefinition = "TEXT")
    private String description; // 공간 상세 설명

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate; // 등록 일자

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpaceType spaceType; // 공간 종류 (스터디룸, 스튜디오 등)

    @Column(nullable = false)
    private Long price; // 공간 가격

    @Column(length = 300, nullable = false)
    private String address; // 주소

    @Column(length = 300, nullable = true)
    private String detailAddress; // 상세 주소

    @Column(length = 300, nullable = true)
    private String neighborhoodInfo; // 주변 정보

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal latitude; // 위도

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal longitude; // 경도

    @Column(name = "max_capacity", nullable = true)
    private Integer maxCapacity; // 최대 인원

    @Column(name = "is_active", nullable = true)
    private Boolean isActive; // 활성화 여부

    @Column(name = "space_rating", precision = 3, scale = 2)
    private BigDecimal spaceRating; // 평점 (ex: 4.5)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private Host host; // 호스트

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private SpaceStatus status; // 공간 승인 상태

    @Column(name = "rejection_reason")
    private String rejectionReason; // 반려 사유

    @Column(name = "image_url", length = 512)
    private String imageUrl; // 대표 이미지 URL

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "space_additional_images", joinColumns = @JoinColumn(name = "space_id"))
    @Column(name = "image_url")
    private List<String> additionalImageUrls = new ArrayList<>(); // 추가 이미지 URL 목록

    @Column(nullable = true) // 환불 규정은 필수는 아닐 수 있습니다. 요구사항에 따라 변경하세요.
    private String refundPolicy;

    @Column(nullable = true) // 이용 규정도 필수는 아닐 수 있습니다. 요구사항에 따라 변경하세요.
    private String spaceRules;

    // 이미지 URL 처리를 위한 헬퍼 메서드 추가
    public void setMainImage(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void addAdditionalImage(String imageUrl) {
        if (this.additionalImageUrls == null) {
            this.additionalImageUrls = new ArrayList<>();
        }
        this.additionalImageUrls.add(imageUrl);
    }

    public void clearAdditionalImages() {
        if (this.additionalImageUrls != null) {
            this.additionalImageUrls.clear();
        }
    }
}
