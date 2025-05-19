package com.likelion.loco_project.domain.reservation.dto;

import com.likelion.loco_project.domain.reservation.entity.Reservation;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationRequestDto {    //예약 요청
    private Long guestId;               //게스트 ID
    private Long spaceId;               //공간 ID
    private String reservationDate;     //예약일
    private int bookingCapacity;        //예약 인원
    private String startTime;           //예약한 시작시간
    private String endTime;             //예약한 종료시간

    public Reservation toEntity() {
        Reservation reservation = new Reservation();
        reservation.setReservationDate(LocalDateTime.parse(reservationDate));
        reservation.setBookingCapacity(bookingCapacity);
        reservation.setStartTime(LocalDateTime.parse(startTime));
        reservation.setEndTime(LocalDateTime.parse(endTime));
        // space, guest는 Service에서 조회 후 주입
        return reservation;
    }

    @Future
    private LocalDateTime startTime;

    @Future
    private LocalDateTime endTime;

    public Long getPaymentId() {
        return null;
    }
}
