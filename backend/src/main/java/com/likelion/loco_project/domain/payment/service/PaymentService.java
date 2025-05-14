package com.likelion.loco_project.domain.payment.service;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.payment.dto.PaymentRequestDto;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.entity.PaymentStatus;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final GuestRepository guestRepository;

    // 결제 요청
    @Transactional
    public Payment createPayment(PaymentRequestDto dto) {
        // dto.getGuestId()가 null인지 먼저 확인
        if (dto.getGuestId() == null) {
            throw new IllegalArgumentException("게스트 ID가 누락되었습니다."); // null인 경우 명확한 예외 발생
        }

        // ID에 해당하는 게스트가 없을 때) 예외를 발생
        Guest guest = guestRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("게스트를 찾을 수 없습니다. ID: " + dto.getGuestId())); // 예외 메시지에 ID 포함

        // PaymentRequestDto에 toEntity() 메소드가 있다고 가정합니다.
        Payment payment = dto.toEntity(); // dto를 Payment 엔티티로 변환

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
        if (id == null) { // ID가 null인 경우를 대비한 체크
            throw new IllegalArgumentException("결제 ID가 누락되었습니다.");
        }

        return paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 존재하지 않습니다."));
    }
}
