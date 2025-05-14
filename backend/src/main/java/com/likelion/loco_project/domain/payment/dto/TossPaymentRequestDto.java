package com.likelion.loco_project.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TossPaymentRequestDto {
    private String orderId;
    private String orderName;
    private String customerName;
    private int amount;
}
