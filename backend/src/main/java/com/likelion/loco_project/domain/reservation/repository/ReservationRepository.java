package com.likelion.loco_project.domain.reservation.repository;

import com.likelion.loco_project.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 게스트 ID로 예약 조회
    List<Reservation> findByGuestId(Long guestId);

    // 특정 공간 ID로 예약 조회
    List<Reservation> findBySpaceId(Long spaceId);

    // 특정 시간 이후 예약 조회 (예: 다가오는 예약들)
    List<Reservation> findByReservationDateAfter(LocalDateTime now);
}
