package com.likelion.loco_project.domain.payment.dto;

import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponseDto {
    private Long id;
    private Long guestId;                               //게스트 ID
    private String paymentMethod;                       //결제 방법
    private int paymentAmount;                          //결제 금액
    private PaymentStatus paymentStatus;                //결제 상태
    private String transactionId;                       //거래 고유번호
    private LocalDateTime paymentAt;                    //결제 일시
    private String paymentFailedReason;                 //결제 실패 사유
    private LocalDateTime refundedAt;                   //환불 일시

    public static PaymentResponseDto from(Payment payment) {
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .guestId(payment.getGuest().getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentAmount(payment.getPaymentAmount())
                .paymentStatus(payment.getPaymentStatus())
                .transactionId(payment.getTransactionId())
                .paymentAt(payment.getPaymentAt())
                .paymentFailedReason(payment.getPaymentFailedReason())
                .refundedAt(payment.getRefundedAt())
                .build();
    }
}
