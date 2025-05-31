package com.likelion.loco_project.domain.admin.controller;

import com.likelion.loco_project.domain.admin.dto.*;
import com.likelion.loco_project.domain.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "관리자 대시보드", description = "관리자 대시보드 관련 API, 대시보드 요약 정보 조회 / 최근 예약 목록 조회 / 처리 대기 공간 목록 조회 / 월별 매출 데이터 조회 / 월별 예약 통계 조회 / 공간 유형별 분포 데이터 조회")
public class AdminDashboardController {
    private final AdminDashboardService dashboardService;

    @Operation(summary = "대시보드 요약 정보 조회", description = "관리자 대시보드의 총 매출, 총 예약, 총 회원, 총 공간 수 등 요약 정보를 조회합니다.")
    @GetMapping("/summary")
    public DashboardSummaryDto getSummary() {
        return dashboardService.getSummary();
    }

    @Operation(summary = "최근 예약 목록 조회", description = "관리자 대시보드에 표시할 최근 예약 목록을 조회합니다.")
    @GetMapping("/recent-reservations")
    public List<DashboardRecentReservationDto> getRecentReservations() {
        return dashboardService.getRecentReservations();
    }

    @Operation(summary = "처리 대기 공간 목록 조회", description = "관리자 대시보드에 표시할 승인 대기 중인 공간 목록을 조회합니다.")
    @GetMapping("/pending-spaces")
    public List<DashboardPendingSpaceDto> getPendingSpaces() {
        return dashboardService.getPendingSpaces();
    }

    @Operation(summary = "월별 매출 데이터 조회", description = "관리자 대시보드의 매출 그래프 데이터를 조회합니다.")
    @GetMapping("/sales-data")
    public DashboardSalesChartDto getSalesData() {
        return dashboardService.getSalesData();
    }

    @Operation(summary = "월별 예약 통계 조회", description = "관리자 대시보드의 예약 통계 그래프 데이터를 조회합니다.")
    @GetMapping("/reservation-stats")
    public DashboardReservationChartDto getReservationStats() {
        return dashboardService.getReservationStats();
    }

    @Operation(summary = "공간 유형별 분포 데이터 조회", description = "관리자 대시보드의 공간 유형별 분포 그래프 데이터를 조회합니다.")
    @GetMapping("/space-type-distribution")
    public DashboardSpaceTypeDistributionDto getSpaceTypeDistribution() {
        return dashboardService.getSpaceTypeDistribution();
    }
}