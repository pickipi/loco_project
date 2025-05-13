package com.likelion.loco_project.domain.space.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "spaces")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Space extends BaseEntity {

    @Column(name = "image_id", nullable = false)
    private Long imageId; // 이미지 ID

    @Column(name = "space_name", length = 100, nullable = false)
    private String spaceName; // 공간 이름

    @Column(columnDefinition = "TEXT")
    private String description; // 공간 상세 설명

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate; // 등록 일자

    @Column(name = "space_type", length = 30, nullable = false)
    private String spaceType; // 공간 종류 (스터디룸, 스튜디오 등)

    @Column(nullable = false)
    private Long price; // 공간 가격

    @Column(length = 300, nullable = false)
    private String address; // 주소

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal latitude; // 위도

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal longitude; // 경도

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity; // 최대 인원

    @Column(name = "is_active", nullable = false)
    private Boolean isActive; // 활성화 여부

    @Column(name = "space_rating", precision = 3, scale = 2)
    private BigDecimal spaceRating; // 평점 (ex: 4.5)
}