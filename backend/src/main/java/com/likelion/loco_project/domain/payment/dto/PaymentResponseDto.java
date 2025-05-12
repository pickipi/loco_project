package com.likelion.loco_project.domain.payment.dto;

import com.likelion.loco_project.domain.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponseDto {               //결제 응답
    private Long id;
    private String paymentMethod;               //결제 방법
    private int paymentAmount;                  //결제 금액
    private PaymentStatus paymentStatus;        //결제 상태
    private String transactionId;               //거래 ID
    private LocalDateTime paymentAt;            //결제 시간
    private String paymentFailedReason;         //결제 실패 사유
    private LocalDateTime refundedAt;           //환불 시간
}
