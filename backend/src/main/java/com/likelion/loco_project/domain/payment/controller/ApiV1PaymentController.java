package com.likelion.loco_project.domain.payment.controller;

import com.likelion.loco_project.domain.payment.dto.PaymentRequestDto;
import com.likelion.loco_project.domain.payment.dto.PaymentResponseDto;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.service.PaymentService;
import com.likelion.loco_project.domain.payment.service.TossPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class ApiV1PaymentController {
    private final PaymentService paymentService;

    // 1. 결제 요청
    @PostMapping
    public ResponseEntity<PaymentResponseDto> createPayment(@Valid @RequestBody PaymentRequestDto paymentRequestDto) {
        Payment createdPayment = paymentService.createPayment(paymentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(PaymentResponseDto.from(createdPayment));
    }

    // 2. 결제 성공
    @PostMapping("/{id}/complete")
    public ResponseEntity<PaymentResponseDto> complete(@PathVariable Long id, @RequestParam String transactionId) {
        Payment completedPayment = paymentService.completePayment(id, transactionId);
        return ResponseEntity.ok(PaymentResponseDto.from(completedPayment));
    }

    // 3. 결제 실패
    @PostMapping("/{id}/fail")
    public ResponseEntity<PaymentResponseDto> fail(@PathVariable Long id, @RequestParam String reason) {
        Payment failedPayment = paymentService.failPayment(id, reason);
        return ResponseEntity.ok(PaymentResponseDto.from(failedPayment));
    }

    // 4. 환불 처리
    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentResponseDto> refund(@PathVariable Long id) {
        Payment refundedPayment = paymentService.refundPayment(id);
        return ResponseEntity.ok(PaymentResponseDto.from(refundedPayment));
    }

    // 5. 게스트별 결제 내역 조회
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<PaymentResponseDto>> getGuestPayments(@PathVariable Long guestId) {
        List<PaymentResponseDto> list = paymentService.getPaymentsByGuestId(guestId).stream()
                .map(PaymentResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // 6. 단일 결제 조회
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable Long id) {
        return paymentService.getPayment(id)
                .map(PaymentResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private final TossPaymentService tossPaymentService;

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(
            @RequestParam String paymentKey,
            @RequestParam String orderId,
            @RequestParam int amount) {
        try {
            String response = tossPaymentService.approvePayment(paymentKey, orderId, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("결제 실패: " + e.getMessage());
        }
    }
}
