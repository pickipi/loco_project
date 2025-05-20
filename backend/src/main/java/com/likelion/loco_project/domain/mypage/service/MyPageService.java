package com.likelion.loco_project.domain.mypage.service;

import com.likelion.loco_project.domain.payment.dto.PaymentResponseDto;
import com.likelion.loco_project.domain.payment.entity.Payment;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import com.likelion.loco_project.domain.reservation.dto.ReservationResponseDto;
import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyPageService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    //게스트의 예약 수
    public List<ReservationResponseDto> getGuestReservations(Long guestId) {
        List<Reservation> reservations = reservationRepository.findByGuestId(guestId);
        log.debug("게스트 ID {}의 예약 수: {}", guestId, reservations.size());
        return reservations.stream()
                .map(ReservationResponseDto::from)
                .collect(Collectors.toList());
    }
    //게스트의 결제 수
    public List<PaymentResponseDto> getGuestPayments(Long guestId) {
        List<Payment> payments = paymentRepository.findByGuestId(guestId);
        log.debug("게스트 ID {}의 결제 수: {}", guestId, payments.size());
        return payments.stream()
                .map(PaymentResponseDto::from)
                .collect(Collectors.toList());
    }
}
