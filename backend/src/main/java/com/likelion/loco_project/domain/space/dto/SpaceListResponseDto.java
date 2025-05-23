package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.Space;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceListResponseDto {
    private Long id;
    private Long imageId;
    private String spaceName;
    private String description;
    private LocalDateTime uploadDate;
    private Long price;
    private String address;
    private String detailAddress;
    private String neighborhoodInfo;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer maxCapacity;
    private Boolean isActive;
    private BigDecimal spaceRating;

    public static SpaceListResponseDto from(Space space) {
        return SpaceListResponseDto.builder()
                .id(space.getId())
                .imageId(space.getImageId())
                .spaceName(space.getSpaceName())
                .description(space.getDescription())
                .uploadDate(space.getUploadDate())
                .price(space.getPrice())
                .address(space.getAddress())
                .detailAddress(space.getDetailAddress())
                .neighborhoodInfo(space.getNeighborhoodInfo())
                .latitude(space.getLatitude())
                .longitude(space.getLongitude())
                .maxCapacity(space.getMaxCapacity())
                .isActive(space.getIsActive())
                .spaceRating(space.getSpaceRating())
                .build();
    }
}
