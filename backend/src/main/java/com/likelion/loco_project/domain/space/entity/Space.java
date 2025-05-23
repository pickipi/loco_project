package com.likelion.loco_project.domain.space.entity;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "spaces")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Space extends BaseEntity {

    @Column(name = "image_id", nullable = true)
    private Long imageId; // 이미지 ID

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
    private String address2; // 상세 주소

    @Column(length = 300, nullable = true)
    private String address3; // 주변 주소

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal latitude; // 위도

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal longitude; // 경도

    @Column(name = "max_capacity", nullable = false)
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

    //찜하기
    @ManyToMany(mappedBy = "favoriteSpaces")
    private Set<User> usersWhoFavorited = new HashSet<>();

}