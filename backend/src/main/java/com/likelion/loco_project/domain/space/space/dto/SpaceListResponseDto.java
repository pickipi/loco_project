package com.likelion.loco_project.domain.space.space.dto;

import com.likelion.loco_project.domain.space.space.entity.Space;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceListResponseDto {
    private Long id;
    private String spaceName;
    private String description;
    private String address;
    private Integer maxCapacity;
    private Integer price;
    private Double spaceRating;
    private String mainImageUrl;

    public static SpaceListResponseDto from(Space space) {
        return SpaceListResponseDto.builder()
                .id(space.getId())
                .spaceName(space.getSpaceName())
                .description(space.getDescription())
                .address(space.getAddress())
                .maxCapacity(space.getMaxCapacity())
                .price(space.getPrice())
                .spaceRating(space.getSpaceRating())
                .mainImageUrl(space.getMainImageUrl())
                .build();
    }
}
