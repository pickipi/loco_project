package com.likelion.loco_project.domain.reservation.service;

import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // 1. 예약 생성
    public Reservation createReservation(Reservation reservation) {
        reservation.setReservationDate(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    // 2. 예약 취소 (Soft Delete 대체 가능)
    @Transactional
    public void cancelReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);
    }

    // 3. 게스트별 예약 내역
    public List<Reservation> getReservationsByGuestId(Long guestId) {
        return reservationRepository.findByGuestId(guestId);
    }

    // 4. 공간별 예약 내역
    public List<Reservation> getReservationsBySpaceId(Long spaceId) {
        return reservationRepository.findBySpaceId(spaceId);
    }

    // 5. 다가오는 예약
    public List<Reservation> getUpcomingReservations() {
        return reservationRepository.findByReservationDateAfter(LocalDateTime.now());
    }

    // 6. 예약 상세 조회
    public Optional<Reservation> getReservation(Long id) {
        return reservationRepository.findById(id);
    }
}
