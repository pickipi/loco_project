package com.likelion.loco_project.domain.payment.dto;

import com.likelion.loco_project.domain.payment.entity.Payment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDto {
    private String paymentMethod;                           //결제 방법
    private int paymentAmount;                              //결제 금액
    private Long guestId;                                   //결제한 게스트 ID

    public Payment toEntity() {
        Payment payment = new Payment();
        payment.setPaymentMethod(this.paymentMethod);
        payment.setPaymentAmount(this.paymentAmount);
        return payment;
    }
}
