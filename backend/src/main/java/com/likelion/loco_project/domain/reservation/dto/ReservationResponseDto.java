package com.likelion.loco_project.domain.reservation.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationResponseDto {       //예약 응답
    private Long id;
    private String reservationDate;         //예약 일시
    private String startTime;               //예약 시작시간
    private String endTime;                 //예약 종료시간
    private String status;                  //예약 상태
    private Long guestId;                   //예약자의 ID
    private Long spaceId;                   //예약된 공간 ID
}
