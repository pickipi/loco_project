package com.likelion.loco_project.domain.space.service;

import com.likelion.loco_project.domain.guest.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.space.Space;
import com.likelion.loco_project.domain.space.dto.SpaceReservationRequestDto;
import com.likelion.loco_project.domain.space.dto.SpaceReservationResponseDto;
import com.likelion.loco_project.domain.space.entity.SpaceReservation;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import com.likelion.loco_project.domain.space.repository.SpaceReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceReservationService {

    private final SpaceReservationRepository reservationRepository;
    private final SpaceRepository spaceRepository;
    private final GuestRepository guestRepository;
    private final NotificationService notificationService;

    @Transactional
    public SpaceReservationResponseDto reserveSpace(Long guestId, SpaceReservationRequestDto dto) {
        // 1. 공간 존재 여부 확인
        Space space = spaceRepository.findById(dto.getSpaceId())
                .orElseThrow(() -> new IllegalArgumentException("해당 공간이 존재하지 않습니다."));

        // 2. 게스트 존재 여부 확인
        Guest guest = guestRepository.findById(guestId)
                .orElseThrow(() -> new IllegalArgumentException("게스트 정보를 찾을 수 없습니다."));

        // 3. 예약 중복 여부 확인
        boolean hasConflict = reservationRepository.existsBySpaceIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                dto.getSpaceId(), dto.getEndTime(), dto.getStartTime());

        if (hasConflict) {
            throw new IllegalStateException("해당 시간대에 이미 예약이 존재합니다.");
        }

        // 4. 예약 생성 및 저장
        SpaceReservation reservation = SpaceReservation.builder()
                .space(space)
                .guest(guest)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();

        reservationRepository.save(reservation);

        return SpaceReservationResponseDto.from(reservation);
    }

    @Transactional(readOnly = true)
    public List<SpaceReservationResponseDto> getReservationsByGuest(Long guestId) {
        return reservationRepository.findByGuestId(guestId).stream()
                .map(SpaceReservationResponseDto::from)
                .collect(Collectors.toList());
    }

    // 예약 확정 시 호출
    notificationService.sendReservationConfirmedNotification(guestId, reservationId);

    // 예약 컨펌
    @Transactional
    public void confirmReservation(Long hostId, Long reservationId) {
        SpaceReservation reservation = spaceReservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (!reservation.getSpace().getHost().getId().equals(hostId)) {
            throw new SecurityException("이 공간의 호스트만 예약을 확정할 수 있습니다.");
        }

        reservation.updateStatus(ReservationStatus.CONFIRMED);
        notificationService.sendReservationConfirmedNotification(
                reservation.getGuest().getId(), reservation.getId());
    }

    // 예약 확정/거절 처리
    public void updateReservationStatus(Long reservationId, ReservationStatus status) {
        SpaceReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다."));

        reservation.setStatus(status);
        reservationRepository.save(reservation);

        Long guestId = reservation.getGuest().getId();
        if (status == ReservationStatus.CONFIRMED) {
            notificationService.sendReservationConfirmedNotification(guestId, reservationId);
        } else if (status == ReservationStatus.REJECTED) {
            notificationService.sendReservationRejectedNotification(guestId, reservationId);
        }
    }


}
