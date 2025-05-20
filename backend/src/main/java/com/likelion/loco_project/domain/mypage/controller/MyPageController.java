package com.likelion.loco_project.domain.mypage.controller;

import com.likelion.loco_project.domain.payment.dto.PaymentResponseDto;
import com.likelion.loco_project.domain.reservation.dto.ReservationResponseDto;
import com.likelion.loco_project.domain.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mypage")
public class MyPageController {

    private final MyPageService myPageService;
    //게스트의 예약 조회
    @GetMapping("/reservations/{guestId}")
    public ResponseEntity<List<ReservationResponseDto>> getGuestReservations(@PathVariable Long guestId) {
        log.info("게스트 {}의 예약 조회 요청", guestId);
        List<ReservationResponseDto> reservations = myPageService.getGuestReservations(guestId);
        return ResponseEntity.ok(reservations);
    }
    //게스트의 결제 조회
    @GetMapping("/payments/{guestId}")
    public ResponseEntity<List<PaymentResponseDto>> getGuestPayments(@PathVariable Long guestId) {
        log.info("게스트 {}의 결제 조회 요청", guestId);
        List<PaymentResponseDto> payments = myPageService.getGuestPayments(guestId);
        return ResponseEntity.ok(payments);
    }
}
