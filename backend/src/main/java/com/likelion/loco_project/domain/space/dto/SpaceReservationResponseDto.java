package com.likelion.loco_project.domain.space.dto;

import com.likelion.loco_project.domain.space.entity.SpaceReservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SpaceReservationResponseDto {
    private Long reservationId;
    private Long guestId;
    private Long spaceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public static SpaceReservationResponseDto from(SpaceReservation reservation) {
        return SpaceReservationResponseDto.builder()
                .reservationId(reservation.getId())
                .guestId(reservation.getGuest().getId())
                .spaceId(reservation.getSpace().getId())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
