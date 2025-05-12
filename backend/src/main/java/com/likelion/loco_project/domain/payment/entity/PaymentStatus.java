package com.likelion.loco_project.domain.payment.entity;

public enum PaymentStatus {
    REQUESTED, // 결제 요청
    COMPLETED, // 결제 완료
    FAILED,    // 결제 실패
    REFUNDED   // 환불 완료
}
