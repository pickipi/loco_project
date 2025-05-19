package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.entity.SpaceStatus;
import com.likelion.loco_project.domain.space.entity.SpaceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "공간 생성 요청 DTO")
public class SpaceCreateRequestDto {

    private SpaceType spaceType;// 공간 유형
    private String spaceName; // 공간 이름
    private String description; // 공간 설명
    private Long imageId; // 이미지
    private LocalDateTime uploadDate;
    private Integer maxCapacity; // 최대 인원
    private String address; // 주소
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Long price;
    private Boolean isActive;
    private BigDecimal spaceRating;
    private SpaceStatus spaceStatus;


    // DTO → Entity 변환 메서드
    public Space toEntity() {
        return Space.builder()
                .imageId(imageId)
                .spaceName(spaceName)
                .description(description)
                .uploadDate(uploadDate)
                .spaceType(spaceType)
                .price(price)
                .address(address)
                .latitude(latitude)
                .longitude(longitude)
                .maxCapacity(maxCapacity)
                .isActive(isActive)
                .spaceRating(spaceRating)
                .status(spaceStatus)
                .build();
    }
}