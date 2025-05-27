package com.likelion.loco_project.domain.payment.controller;

import com.likelion.loco_project.domain.payment.dto.PaymentRequestDto;
import com.likelion.loco_project.domain.payment.dto.PaymentResponseDto;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import com.likelion.loco_project.domain.payment.service.TossPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "결제", description = "결제 관련 API, 결제 요청 / 완료 / 실패 / 환불")
public class ApiV1PaymentController {
    private final PaymentService paymentService;

    @Operation(summary = "결제 요청", description = "새로운 결제를 요청합니다.")
    @PostMapping
    public ResponseEntity<PaymentResponseDto> createPayment(@Valid @RequestBody PaymentRequestDto paymentRequestDto) {
        Payment createdPayment = paymentService.createPayment(paymentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(PaymentResponseDto.from(createdPayment));
    }

    @Operation(summary = "결제 완료", description = "결제를 완료 처리합니다.")
    @PostMapping("/{id}/complete")
    public ResponseEntity<PaymentResponseDto> complete(@PathVariable Long id, @RequestParam String transactionId) {
        Payment completedPayment = paymentService.completePayment(id, transactionId);
        return ResponseEntity.ok(PaymentResponseDto.from(completedPayment));
    }

    @Operation(summary = "결제 실패", description = "결제 실패를 처리합니다.")
    @PostMapping("/{id}/fail")
    public ResponseEntity<PaymentResponseDto> fail(@PathVariable Long id, @RequestParam String reason) {
        Payment failedPayment = paymentService.failPayment(id, reason);
        return ResponseEntity.ok(PaymentResponseDto.from(failedPayment));
    }

    @Operation(summary = "환불 처리", description = "결제된 금액을 환불 처리합니다.")
    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentResponseDto> refund(@PathVariable Long id) {
        Payment refundedPayment = paymentService.refundPayment(id);
        return ResponseEntity.ok(PaymentResponseDto.from(refundedPayment));
    }

    @Operation(summary = "게스트별 결제 내역 조회", description = "특정 게스트의 모든 결제 내역을 조회합니다.")
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<PaymentResponseDto>> getGuestPayments(@PathVariable Long guestId) {
        List<PaymentResponseDto> list = paymentService.getPaymentsByGuestId(guestId).stream()
                .map(PaymentResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "결제 상세 조회", description = "결제 ID로 특정 결제의 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable Long id) {
        return paymentService.getPayment(id)
                .map(PaymentResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private final TossPaymentService tossPaymentService;

    @Operation(summary = "결제 승인 (토스페이먼츠)", description = "토스페이먼츠 결제를 승인합니다.")
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
