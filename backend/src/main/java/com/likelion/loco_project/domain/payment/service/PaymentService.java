package com.likelion.loco_project.domain.payment.service;

import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import com.likelion.loco_project.domain.payment.entity.PaymentStatus;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // 1. 결제 요청
    public Payment createPayment(Payment payment) {
        payment.setPaymentRequestedAt(LocalDateTime.now());
        payment.setPaymentStatus(PaymentStatus.REQUESTED);
        return paymentRepository.save(payment);
    }

    // 2. 결제 성공 처리
    @Transactional
    public Payment completePayment(Long paymentId, String transactionId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보 없음"));

        payment.setTransactionId(transactionId);
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setPaymentAt(LocalDateTime.now());

        return payment;
    }

    // 3. 결제 실패 처리
    @Transactional
    public Payment failPayment(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보 없음"));

        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setPaymentFailedReason(reason);
        return payment;
    }

    // 4. 환불 처리
    @Transactional
    public Payment refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보 없음"));

        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setRefundedAt(LocalDateTime.now());
        return payment;
    }

    // 5. 게스트별 결제 내역 조회
    public List<Payment> getPaymentsByGuestId(Long guestId) {
        return paymentRepository.findByGuestId(guestId);
    }

    // 6. 단일 결제 조회
    public Optional<Payment> getPayment(Long id) {
        return paymentRepository.findById(id);
    }
}
