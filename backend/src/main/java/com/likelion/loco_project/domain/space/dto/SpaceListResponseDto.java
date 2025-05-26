package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.Space;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceListResponseDto {
    private Long id;
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
    private String imageUrl;  // 대표 이미지 URL 추가
    private List<String> additionalImageUrls;  // 추가 이미지 URL 목록 추가

    public static SpaceListResponseDto from(Space space) {
        return SpaceListResponseDto.builder()
                .id(space.getId())
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
                .imageUrl(space.getImageUrl())
                .additionalImageUrls(space.getAdditionalImageUrls())
                .build();
    }
}
