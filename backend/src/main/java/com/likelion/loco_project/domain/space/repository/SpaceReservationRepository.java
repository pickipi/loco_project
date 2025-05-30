package com.likelion.loco_project.domain.space.repository;

import com.likelion.loco_project.domain.space.entity.SpaceReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SpaceReservationRepository extends JpaRepository<SpaceReservation, Long> {

    // 특정 게스트의 모든 공간 예약 목록 조회
    List<SpaceReservation> findByGuestId(Long guestId);

    // 특정 공간의 지정 시간대에 중복 예약 여부 확인
    boolean existsBySpaceIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Long spaceId, LocalDateTime endTime, LocalDateTime startTime
    );
}
