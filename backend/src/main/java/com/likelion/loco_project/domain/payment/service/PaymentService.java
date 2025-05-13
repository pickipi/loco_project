package com.likelion.loco_project.domain.payment.service;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.payment.dto.PaymentRequestDto;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.entity.PaymentStatus;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final GuestRepository guestRepository;

    public PaymentService(PaymentRepository paymentRepository, GuestRepository guestRepository) {
        this.paymentRepository = paymentRepository;
        this.guestRepository = guestRepository;
    }

    // 결제 요청
    public Payment createPayment(PaymentRequestDto dto) {
        Guest guest = guestRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("게스트를 찾을 수 없습니다."));

        Payment payment = dto.toEntity();
        payment.setGuest(guest);
        payment.setPaymentRequestedAt(LocalDateTime.now());
        payment.setPaymentStatus(PaymentStatus.REQUESTED);

        return paymentRepository.save(payment);
    }

    // 결제 성공
    @Transactional
    public Payment completePayment(Long paymentId, String transactionId) {
        Payment payment = findPaymentById(paymentId);
        payment.setTransactionId(transactionId);
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setPaymentAt(LocalDateTime.now());
        return payment;
    }

    // 결제 실패
    @Transactional
    public Payment failPayment(Long paymentId, String reason) {
        Payment payment = findPaymentById(paymentId);
        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setPaymentFailedReason(reason);
        return payment;
    }

    // 환불 처리
    @Transactional
    public Payment refundPayment(Long paymentId) {
        Payment payment = findPaymentById(paymentId);
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setRefundedAt(LocalDateTime.now());
        return payment;
    }

    // 단일 결제 조회
    public Optional<Payment> getPayment(Long id) {
        return paymentRepository.findById(id);
    }

    // 게스트별 결제 내역
    public List<Payment> getPaymentsByGuestId(Long guestId) {
        return paymentRepository.findByGuestId(guestId);
    }

    private Payment findPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 존재하지 않습니다."));
    }
}
