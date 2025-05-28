package com.likelion.loco_project.domain.mypage.controller;

import com.likelion.loco_project.domain.payment.dto.PaymentResponseDto;
import com.likelion.loco_project.domain.reservation.dto.ReservationResponseDto;
import com.likelion.loco_project.domain.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mypage")
@Tag(name = "마이페이지", description = "마이페이지 관련 API, 예약 조회 / 결제 조회")
public class MyPageController {

    private final MyPageService myPageService;
    //게스트의 예약 조회
    @Operation(summary = "게스트 예약 목록 조회", description = "특정 게스트의 예약 목록을 조회합니다.")
    @GetMapping("/reservations/{guestId}")
    public ResponseEntity<List<ReservationResponseDto>> getGuestReservations(@PathVariable Long guestId) {
        log.info("게스트 {}의 예약 조회 요청", guestId);
        List<ReservationResponseDto> reservations = myPageService.getGuestReservations(guestId);
        return ResponseEntity.ok(reservations);
    }
    //게스트의 결제 조회
    @Operation(summary = "게스트 결제 목록 조회", description = "특정 게스트의 결제 목록을 조회합니다.")
    @GetMapping("/payments/{guestId}")
    public ResponseEntity<List<PaymentResponseDto>> getGuestPayments(@PathVariable Long guestId) {
        log.info("게스트 {}의 결제 조회 요청", guestId);
        List<PaymentResponseDto> payments = myPageService.getGuestPayments(guestId);
        return ResponseEntity.ok(payments);
    }
}