package com.likelion.loco_project.domain.reservation.entity;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.space.entity.Space;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Reservation {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;                    //결제 정보

    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;                        //예약된 공간 정보

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;                        //예약한 게스트의 정보

    private LocalDateTime reservationDate;      //예약 일시
    private LocalDateTime startTime;            //예약 시작시간
    private LocalDateTime endTime;              //예약 종료시간
    private int bookingCapacity;                //예약 인원수
}
