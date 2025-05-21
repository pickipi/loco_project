package com.likelion.loco_project.domain.admin.service;

import com.likelion.loco_project.domain.admin.dto.DashboardSummaryDto;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import com.likelion.loco_project.domain.reservation.repository.ReservationRepository;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;

    public DashboardSummaryDto getSummary() {
        long userCount = userRepository.count();
        long spaceCount = spaceRepository.count();
        long reservationCount = reservationRepository.count();
        long paymentSum = paymentRepository.sumAllPayments(); // sumAllPayments()는 직접 구현 필요

        return DashboardSummaryDto.builder()
                .userCount(userCount)
                .spaceCount(spaceCount)
                .reservationCount(reservationCount)
                .totalRevenue(paymentSum)
                .build();
    }
}