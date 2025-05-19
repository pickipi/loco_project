package com.likelion.loco_project.domain.payment.dto;

import com.likelion.loco_project.domain.payment.entity.Payment;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    private String paymentMethod;                           //결제 방법
    private int paymentAmount;                              //결제 금액

    @NotNull(message = "게스트 ID는 필수입니다.")
    private Long guestId;                                   //결제한 게스트 ID

    @NotBlank(message = "주문 ID는 필수입니다.")                //주문ID
    private String orderId;

    @NotBlank(message = "주문 이름은 필수입니다.")                //주문명
    private String orderName;

    @NotBlank(message = "고객 이름은 필수입니다.")                //고객명
    private String customerName;

    @NotNull(message = "금액은 필수입니다.")                    //결제금액 최소조건
    @Min(value = 100, message = "결제 금액은 최소 100원 이상이어야 합니다.")
    private Integer amount;


    public Payment toEntity() {
        Payment payment = new Payment();
        payment.setPaymentMethod(this.paymentMethod);
        payment.setPaymentAmount(this.paymentAmount);
        return payment;
    }
}
