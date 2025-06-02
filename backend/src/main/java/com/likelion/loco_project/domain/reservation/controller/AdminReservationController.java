package com.likelion.loco_project.domain.reservation.controller;

import com.likelion.loco_project.domain.reservation.dto.AdminReservationResponseDto;
import com.likelion.loco_project.domain.reservation.service.AdminReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {
    private final AdminReservationService adminReservationService;

    @GetMapping
    public ResponseEntity<List<AdminReservationResponseDto>> getAllReservations() {
        List<AdminReservationResponseDto> reservations = adminReservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }
} 