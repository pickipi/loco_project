package com.likelion.loco_project.domain.space.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SpaceReservationRequestDto {
    private Long guestId;
    private Long spaceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
