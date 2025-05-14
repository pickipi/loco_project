package com.likelion.loco_project.domain.payment.controller;

import com.likelion.loco_project.domain.payment.dto.PaymentRequestDto;
import com.likelion.loco_project.domain.payment.dto.PaymentResponseDto;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
public class ApiV1PaymentController {

    private final PaymentService paymentService;

    public ApiV1PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 1. 결제 요청
    @PostMapping
    public ResponseEntity<PaymentResponseDto> createPayment(@RequestBody PaymentRequestDto dto) {
        Payment payment = paymentService.createPayment(dto);
        return ResponseEntity.ok(PaymentResponseDto.from(payment));
    }

    // 2. 결제 성공
    @PostMapping("/{id}/complete")
    public ResponseEntity<PaymentResponseDto> complete(@PathVariable Long id, @RequestParam String transactionId) {
        Payment payment = paymentService.completePayment(id, transactionId);
        return ResponseEntity.ok(PaymentResponseDto.from(payment));
    }

    // 3. 결제 실패
    @PostMapping("/{id}/fail")
    public ResponseEntity<PaymentResponseDto> fail(@PathVariable Long id, @RequestParam String reason) {
        Payment payment = paymentService.failPayment(id, reason);
        return ResponseEntity.ok(PaymentResponseDto.from(payment));
    }

    // 4. 환불 처리
    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentResponseDto> refund(@PathVariable Long id) {
        Payment payment = paymentService.refundPayment(id);
        return ResponseEntity.ok(PaymentResponseDto.from(payment));
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
}
