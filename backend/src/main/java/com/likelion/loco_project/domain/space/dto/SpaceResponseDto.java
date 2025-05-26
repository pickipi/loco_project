package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.entity.SpaceType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class SpaceResponseDto {
    private Long id;
    private Long hostId;
    private Long imageId;
    private String spaceName;
    private String description;
    private LocalDateTime uploadDate;
    private SpaceType spaceType;
    private Long price;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer maxCapacity;
    private Boolean isActive;
    private BigDecimal spaceRating;
    private Boolean isFavoritedByMe;
    private String imageUrl;
    private List<String> additionalImageUrls;

    // Space 엔티티를 DTO로 변환하는 정적 팩토리 메서드
    public static SpaceResponseDto fromEntity(Space space) {
        return SpaceResponseDto.builder()
                .id(space.getId())
                //.imageId(space.getImageId())
                .hostId(space.getHost().getId())
                .spaceName(space.getSpaceName())
                .description(space.getDescription())
                .uploadDate(space.getUploadDate())
                .spaceType(space.getSpaceType())
                .price(space.getPrice())
                .address(space.getAddress())
                .latitude(space.getLatitude())
                .longitude(space.getLongitude())
                .maxCapacity(space.getMaxCapacity())
                .isActive(space.getIsActive())
                .spaceRating(space.getSpaceRating())
                .imageUrl(space.getImageUrl())
                .additionalImageUrls(space.getAdditionalImageUrls())
                //.isFavoritedByMe(isFavoritedByMe)
                .build();
    }
}
