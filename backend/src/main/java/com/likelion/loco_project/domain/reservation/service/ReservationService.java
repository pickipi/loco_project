package com.likelion.loco_project.domain.reservation.service;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import com.likelion.loco_project.domain.reservation.dto.ReservationRequestDto;
import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.repository.ReservationRepository;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final PaymentRepository paymentRepository;
    private final SpaceRepository spaceRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              GuestRepository guestRepository,
                              PaymentRepository paymentRepository,
                              SpaceRepository spaceRepository) {
        this.reservationRepository = reservationRepository;
        this.guestRepository = guestRepository;
        this.paymentRepository = paymentRepository;
        this.spaceRepository = spaceRepository;
    }

    @Transactional
    public Reservation createReservation(ReservationRequestDto dto) {
        Guest guest = guestRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("게스트 정보 없음"));

        Payment payment = paymentRepository.findById(dto.getPaymentId())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보 없음"));

        Space space = spaceRepository.findById(dto.getSpaceId())
                .orElseThrow(() -> new IllegalArgumentException("공간 정보 없음"));

        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setPayment(payment);
        reservation.setSpace(space);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setBookingCapacity(dto.getBookingCapacity());
        reservation.setStartTime(dto.getStartTime());
        reservation.setEndTime(dto.getEndTime());

        return reservationRepository.save(reservation);
    }

    //예약 가능시간 확인
    public void validateReservationTime(ReservationRequestDto request) {
        // 시작 시간이 종료 시간보다 나중이면 예외 발생
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new IllegalArgumentException("시작 시간은 종료 시간보다 빨라야 합니다.");
        }

        // 중복 예약 검사 (구현 필요)
        // boolean isOverlapping = reservationRepository.existsByStartTimeLessThanAndEndTimeGreaterThan(
        //         request.getEndTime(), request.getStartTime());

        // if (isOverlapping) {
        //     throw new IllegalStateException("해당 시간대에 이미 예약이 존재합니다.");
        // }
    }

    public Optional<Object> getReservation(Long id) {
        return null;
    }

    public List<Reservation> getReservationsByGuestId(Long guestId) {
        return null;
    }

    public Reservation cancelReservation(Long id) {
        return null;
    }
}
