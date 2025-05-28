package com.likelion.loco_project.domain.reservation.controller;

import com.likelion.loco_project.domain.reservation.dto.ReservationRequestDto;
import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
@Tag(name = "예약", description = "예약 관련 API, 예약 생성 / 조회 / 취소")
public class ApiV1ReservationController {

    private final ReservationService reservationService;

    public ApiV1ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @Operation(summary = "예약 생성", description = "새로운 예약을 생성합니다.")
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequestDto requestDto) {
        Reservation reservation = reservationService.createReservation(requestDto);
        return ResponseEntity.ok(reservation);
    }

    @Operation(summary = "예약 상세 조회", description = "예약 ID로 특정 예약의 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<Object> getReservation(@PathVariable Long id) {
        return reservationService.getReservation(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "게스트별 예약 목록 조회", description = "특정 게스트의 모든 예약 내역을 조회합니다.")
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<Reservation>> getReservationsByGuestId(@PathVariable Long guestId) {
        List<Reservation> reservations = reservationService.getReservationsByGuestId(guestId);
        return ResponseEntity.ok(reservations);
    }

    @Operation(summary = "예약 취소", description = "기존 예약을 취소 처리합니다.")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.cancelReservation(id);
        return ResponseEntity.ok(reservation);
    }
}
