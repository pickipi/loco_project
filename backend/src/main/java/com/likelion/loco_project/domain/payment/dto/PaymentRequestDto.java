package com.likelion.loco_project.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDto {            //결제 요청
    private Long guestId;                   //게스트 ID
    private String paymentMethod;           //결제 방법
    private int paymentAmount;              //결제 금액
}