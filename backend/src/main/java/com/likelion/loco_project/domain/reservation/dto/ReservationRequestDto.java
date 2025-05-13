package com.likelion.loco_project.domain.reservation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequestDto {    //예약 요청
    private Long guestId;               //게스트 ID
    private Long spaceId;               //공간 ID
    private String reservationDate;     //예약일
    private String startTime;           //예약한 시작시간
    private String endTime;             //예약한 종료시간
}
