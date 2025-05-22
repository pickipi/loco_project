package com.likelion.loco_project.domain.reservation.repository;

import com.likelion.loco_project.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 게스트 ID로 예약 조회
    List<Reservation> findByGuestId(Long guestId);

    // 특정 공간 ID로 예약 조회
    List<Reservation> findBySpaceId(Long spaceId);

    // 특정 시간 이후 예약 조회 (예: 다가오는 예약들)
    List<Reservation> findByReservationDateAfter(LocalDateTime now);


    // 특정 공간의 예약 가능 여부 확인 (시간 겹침 여부 체크)
    @Query("""
    SELECT r FROM Reservation r
    WHERE r.space.id = :spaceId
      AND r.endTime > :startTime
      AND r.startTime < :endTime
    """)
    List<Reservation> findOverlappingReservations(
            @Param("spaceId") Long spaceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    //게스트 + 공간 기준으로 예약 확인 (중복 예약 방지)
    Optional<Reservation> findByGuestIdAndSpaceId(Long guestId, Long spaceId);

    // 최근 예약 5건 (최신순)
    List<Reservation> findTop5ByOrderByIdDesc();

}
