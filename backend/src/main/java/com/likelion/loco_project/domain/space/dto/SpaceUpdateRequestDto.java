package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.entity.SpaceType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpaceUpdateRequestDto {
    private String spaceName;
    private String description;
    private LocalDateTime uploadDate;
    private SpaceType spaceType;
    private Long price;
    private String address;
    private String detailAddress;  // Changed from address2
    private String neighborhoodInfo;  // Changed from address3
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer maxCapacity;
    private Boolean isActive;
    private BigDecimal spaceRating;
    private String imageUrl;
    private List<String> additionalImageUrls;

    //Space 엔티티에 값을 반영하는 메서드
    public void applyTo(Space space) {
        if (this.spaceName != null) space.setSpaceName(this.spaceName);
        if (this.description != null) space.setDescription(this.description);
        if (this.uploadDate != null) space.setUploadDate(this.uploadDate);
        if (this.spaceType != null) space.setSpaceType(this.spaceType);
        if (this.price != null) space.setPrice(this.price);
        if (this.address != null) space.setAddress(this.address);
        if (this.detailAddress != null) space.setDetailAddress(this.detailAddress); // Changed from address2
        if (this.neighborhoodInfo != null) space.setNeighborhoodInfo(this.neighborhoodInfo); // Changed from address3
        if (this.latitude != null) space.setLatitude(this.latitude);
        if (this.longitude != null) space.setLongitude(this.longitude);
        if (this.maxCapacity != null) space.setMaxCapacity(this.maxCapacity);
        if (this.isActive != null) space.setIsActive(this.isActive);
        if (this.spaceRating != null) space.setSpaceRating(this.spaceRating);
        if (this.imageUrl != null) space.setImageUrl(this.imageUrl);
        if (this.additionalImageUrls != null) {
            space.getAdditionalImageUrls().clear();
            space.getAdditionalImageUrls().addAll(this.additionalImageUrls);
        }
    }
}
