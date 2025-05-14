package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.Space;
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

    private Long imageId;
    private String spaceName;
    private String description;
    private LocalDateTime uploadDate;
    private String spaceType;
    private Long price;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer maxCapacity;
    private Boolean isActive;
    private BigDecimal spaceRating;

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
                .build();
    }
}