package com.likelion.loco_project.domain.reservation.dto;

import com.likelion.loco_project.domain.reservation.entity.Reservation;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationResponseDto {       //예약 응답
    private Long id;
    private String reservationDate;         //예약 일시
    private int bookingCapacity;            //예약 인원
    private String startTime;               //예약 시작시간
    private String endTime;                 //예약 종료시간
    private String status;                  //예약 상태
    private Long guestId;                   //예약자의 ID
    private Long spaceId;                   //예약된 공간 ID
    private Long paymentId;                 //결제된

    public void ReservationResponseDTO(Reservation reservation) {
        this.id = reservation.getId();
        this.paymentId = reservation.getPayment().getId();
        this.spaceId = reservation.getSpace().getId();
        this.guestId = reservation.getGuest().getId();
        this.bookingCapacity = reservation.getBookingCapacity();
        this.startTime = String.valueOf(reservation.getStartTime());
        this.endTime = String.valueOf(reservation.getEndTime());
    }

    public static ReservationResponseDto from(Reservation reservation) {
        return ReservationResponseDto.builder()
                .id(reservation.getId())
                .guestId(reservation.getGuest().getId())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .build();
    }
}
