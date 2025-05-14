package com.likelion.loco_project.domain.payment.entity;

import com.likelion.loco_project.domain.guest.entity.Guest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue
    private Long id;

    private LocalDateTime paymentRequestedAt;           //결제 요청 시간
    private String paymentMethod;                       //결제 방법
    private int paymentAmount;                          //결제 금액

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;                //결제 상태

    private String transactionId;                       //거래 고유 번호
    private LocalDateTime paymentAt;                    //결제 일시
    private String paymentFailedReason;                 //결제 실패 사유
    private LocalDateTime refundedAt;                   //환불 날짜

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;                                //게스트 정보
}
