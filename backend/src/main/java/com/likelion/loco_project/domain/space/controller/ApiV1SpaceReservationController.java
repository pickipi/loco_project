package com.likelion.loco_project.domain.space.controller;

import com.likelion.loco_project.domain.space.dto.SpaceReservationRequestDto;
import com.likelion.loco_project.domain.space.dto.SpaceReservationResponseDto;
import com.likelion.loco_project.domain.space.service.SpaceReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/space-reservations")
public class ApiV1SpaceReservationController {

    private final SpaceReservationService reservationService;

    // 공간 예약 생성
    @PostMapping
    public ResponseEntity<SpaceReservationResponseDto> reserveSpace(
            @RequestParam Long guestId, // 인증 기능 미도입 기준으로 요청
            @RequestBody SpaceReservationRequestDto requestDto
    ) {
        SpaceReservationResponseDto responseDto = reservationService.reserveSpace(guestId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 특정 게스트의 예약 목록 조회
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<SpaceReservationResponseDto>> getReservationsByGuest(
            @PathVariable Long guestId
    ) {
        List<SpaceReservationResponseDto> reservations = reservationService.getReservationsByGuest(guestId);
        return ResponseEntity.ok(reservations);
    }
    //예약 컨펌
    @PatchMapping("/{reservationId}/confirm")
    public ResponseEntity<Void> confirmReservation(
            @RequestHeader("hostId") Long hostId,
            @PathVariable Long reservationId
    ) {
        spaceReservationService.confirmReservation(hostId, reservationId);
        return ResponseEntity.ok().build();
    }
    // 예약 상태 변경 엔드포인트 추가
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {
        spaceReservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
