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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyPageService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public List<ReservationResponseDto> getGuestReservations(Long guestId) {
        log.info("게스트 ID {}의 예약 내역 조회 시작", guestId);
        try {
            List<Reservation> reservations = reservationRepository.findByGuestId(guestId);
            log.info("게스트 ID {}의 예약 수: {}", guestId, reservations.size());
            return reservations.stream()
                    .map(ReservationResponseDto::from)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("게스트 ID {}의 예약 내역 조회 중 오류 발생: {}", guestId, e.getMessage());
            throw new RuntimeException("예약 내역 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getGuestPayments(Long guestId) {
        log.info("게스트 ID {}의 결제 내역 조회 시작", guestId);
        try {
            List<Payment> payments = paymentRepository.findByGuestId(guestId);
            log.info("게스트 ID {}의 결제 수: {}", guestId, payments.size());
            return payments.stream()
                    .map(PaymentResponseDto::from)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("게스트 ID {}의 결제 내역 조회 중 오류 발생: {}", guestId, e.getMessage());
            throw new RuntimeException("결제 내역 조회 중 오류가 발생했습니다.", e);
        }
    }
}