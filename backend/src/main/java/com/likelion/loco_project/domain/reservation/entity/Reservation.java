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

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;                            //결제 정보

    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;                                //공간 정보

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;                                //게스트 정보

    private LocalDateTime reservationDate;              //예약 일시
    private int bookingCapacity;                        //예약 인원
    private LocalDateTime startTime;                    //예약 시작시간
    private LocalDateTime endTime;                      //예약 끝시간

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;                   //에약 상황

}
