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
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
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
        Guest guest = (Guest) guestRepository.findById(dto.getGuestId())
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
        reservation.setStartTime(LocalDateTime.parse(dto.getStartTime()));
        reservation.setEndTime(LocalDateTime.parse(dto.getEndTime()));

        return reservationRepository.save(reservation);
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
