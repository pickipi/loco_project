package com.likelion.loco_project.domain.reservation.controller;

import com.likelion.loco_project.domain.reservation.dto.ReservationRequestDto;
import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
public class ApiV1ReservationController {

    private final ReservationService reservationService;

    public ApiV1ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // 1. 예약 생성
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequestDto requestDto) {
        Reservation reservation = reservationService.createReservation(requestDto);
        return ResponseEntity.ok(reservation);
    }

    // 2. 예약 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Object> getReservation(@PathVariable Long id) {
        return reservationService.getReservation(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. 게스트별 예약 목록 조회
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<Reservation>> getReservationsByGuestId(@PathVariable Long guestId) {
        List<Reservation> reservations = reservationService.getReservationsByGuestId(guestId);
        return ResponseEntity.ok(reservations);
    }

    // 4. 예약 취소
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.cancelReservation(id);
        return ResponseEntity.ok(reservation);
    }
}
