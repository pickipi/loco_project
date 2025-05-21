package com.likelion.loco_project.domain.admin.service;

import com.likelion.loco_project.domain.admin.dto.*;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import com.likelion.loco_project.domain.reservation.repository.ReservationRepository;
import com.likelion.loco_project.domain.payment.repository.PaymentRepository;
import com.likelion.loco_project.domain.payment.entity.PaymentStatus;
import com.likelion.loco_project.domain.space.entity.SpaceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

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
        Long paymentSum = paymentRepository.sumAllPayments(PaymentStatus.COMPLETED);
        if (paymentSum == null) paymentSum = 0L;
        return DashboardSummaryDto.builder()
                .userCount(userCount)
                .spaceCount(spaceCount)
                .reservationCount(reservationCount)
                .totalRevenue(paymentSum)
                .build();
    }

    public List<DashboardRecentReservationDto> getRecentReservations() {
        return reservationRepository.findTop5ByOrderByIdDesc().stream()
                .map(r -> DashboardRecentReservationDto.builder()
                        .id(r.getId())
                        .user(r.getGuest().getUser().getUsername())
                        .space(r.getSpace().getSpaceName())
                        .date(r.getReservationDate().format(DateTimeFormatter.ISO_DATE))
                        .status("예약완료")
                        .build())
                .collect(Collectors.toList());
    }

    public List<DashboardPendingSpaceDto> getPendingSpaces() {
        return spaceRepository.findTop5ByStatusOrderByIdDesc(SpaceStatus.PENDING).stream()
                .map(s -> DashboardPendingSpaceDto.builder()
                        .id(s.getId())
                        .name(s.getSpaceName())
                        .owner(s.getHost().getUser().getUsername())
                        .submitted(s.getUploadDate().format(DateTimeFormatter.ISO_DATE))
                        .build())
                .collect(Collectors.toList());
    }

    public DashboardSalesChartDto getSalesData() {
        // 예시: 최근 6개월 매출 (월별)
        List<String> labels = List.of("1월", "2월", "3월", "4월", "5월", "6월");
        List<Long> data = List.of(200L, 400L, 300L, 500L, 700L, 600L); // 실제 쿼리로 대체 필요
        return DashboardSalesChartDto.builder().labels(labels).data(data).build();
    }

    public DashboardReservationChartDto getReservationStats() {
        // 예시: 최근 6개월 예약 (월별)
        List<String> labels = List.of("1월", "2월", "3월", "4월", "5월", "6월");
        List<Long> data = List.of(50L, 80L, 60L, 120L, 150L, 130L); // 실제 쿼리로 대체 필요
        return DashboardReservationChartDto.builder().labels(labels).data(data).build();
    }

    public DashboardSpaceTypeDistributionDto getSpaceTypeDistribution() {
        Map<String, Long> distribution = spaceRepository.countSpacesByType();
        return DashboardSpaceTypeDistributionDto.builder()
                .distribution(distribution)
                .build();
    }
}