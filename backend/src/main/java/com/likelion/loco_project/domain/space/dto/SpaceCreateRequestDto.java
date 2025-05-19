package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.host.entity.Host;
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

//    @Schema(description = "호스트Id", example = "1")
//    private Long hostId;

    @Schema(description = "공간 유형", example = "MEETING")
    private SpaceType spaceType;

    @Schema(description = "공간 이름", example = "서울 강남점 스터디룸 A")
    private String spaceName;

    @Schema(description = "공간 설명", example = "쾌적한 환경의 6인용 스터디룸입니다.")
    private String description;

    @Schema(description = "이미지 ID", example = "10")
    private Long imageId;

    @Schema(description = "등록일", example = "2025-05-19T10:00:00")
    private LocalDateTime uploadDate;

    @Schema(description = "최대 수용 인원", example = "6")
    private Integer maxCapacity;

    @Schema(description = "기본 주소", example = "서울시 강남구")
    private String address;

    @Schema(description = "상세 주소", example = "테헤란로 123 5층")
    private String address2;

    @Schema(description = "주변 정보", example = "강남역 2번 출구 인근")
    private String address3;

    @Schema(description = "위도", example = "37.498095")
    private BigDecimal latitude;

    @Schema(description = "경도", example = "127.027610")
    private BigDecimal longitude;

    @Schema(description = "가격", example = "15000")
    private Long price;

    @Schema(description = "공개 여부", example = "true")
    private Boolean isActive;

    // ✅ DTO → Entity (Host 주입)
    public Space toEntity(Host host) {
        return Space.builder()
                .host(host)
                .spaceName(spaceName)
                .description(description)
                .uploadDate(uploadDate != null ? uploadDate : LocalDateTime.now())
                .spaceType(spaceType)
                .price(price)
                .address(address)
                .address2(address2)
                .address3(address3)
                .latitude(latitude)
                .longitude(longitude)
                .maxCapacity(maxCapacity)
                .isActive(isActive != null ? isActive : true)
                .imageId(imageId)
                .spaceRating(spaceRating)
                .status(SpaceStatus.PENDING)
                .build();
    }
}