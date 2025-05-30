package com.likelion.loco_project.domain.reservation.service;

import com.likelion.loco_project.domain.reservation.dto.AdminReservationResponseDto;
import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReservationService {
    private final ReservationRepository reservationRepository;

    public List<AdminReservationResponseDto> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
                .map(AdminReservationResponseDto::from)
                .collect(Collectors.toList());
    }
} 