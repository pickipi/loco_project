package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.entity.SpaceStatus;
import com.likelion.loco_project.domain.space.entity.SpaceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "공간 생성 요청 DTO")
public class SpaceCreateRequestDto {
    @Schema(description = "공간 유형", example = "MEETING")
    private SpaceType type;

    @Schema(description = "공간 이름", example = "서울 강남점 스터디룸 A")
    private String name;

    @Schema(description = "공간 설명", example = "쾌적한 환경의 6인용 스터디룸입니다.")
    private String description;

    @Schema(description = "이미지 URL 목록")
    private List<String> imageUrls;

    @Schema(description = "최대 수용 인원", example = "6")
    private Integer capacity;

    @Schema(description = "기본 주소", example = "서울시 강남구")
    private String address;

    @Schema(description = "상세 주소", example = "테헤란로 123 5층")
    private String detailAddress;

    @Schema(description = "주변 정보", example = "강남역 2번 출구 인근")
    private String neighborhoodInfo;

    @Schema(description = "위도", example = "37.498095")
    private BigDecimal latitude;

    @Schema(description = "경도", example = "127.027610")
    private BigDecimal longitude;

    @Schema(description = "가격", example = "15000")
    private Long price;

    @Schema(description = "환불 규정", example = "예약일 3일 전까지 100% 환불")
    private String refundPolicy;

    @Schema(description = "이용 규정", example = "취사 금지, 금연")
    private String spaceRules;

    // DTO → Entity (Host 주입)
    public Space toEntity(Host host) {
        List<String> additionalUrls = new ArrayList<>();
        String mainImageUrl = null;
        
        if (imageUrls != null && !imageUrls.isEmpty()) {
            mainImageUrl = imageUrls.get(0);
            if (imageUrls.size() > 1) {
                additionalUrls = new ArrayList<>(imageUrls.subList(1, imageUrls.size()));
            }
        }

        return Space.builder()
                .host(host)
                .spaceName(this.name)
                .description(description)
                .uploadDate(LocalDateTime.now())
                .spaceType(this.type)
                .price(this.price)
                .address(address)
                .detailAddress(detailAddress)
                .neighborhoodInfo(neighborhoodInfo)
                .latitude(latitude)
                .longitude(longitude)
                .maxCapacity(this.capacity)
                .isActive(true)
                .imageUrl(mainImageUrl)
                .additionalImageUrls(additionalUrls)
                .spaceRating(BigDecimal.ZERO)
                .status(SpaceStatus.PENDING)
                .build();
    }
}
