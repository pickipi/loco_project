package com.likelion.loco_project.domain.admin.controller;

import com.likelion.loco_project.domain.admin.dto.*;
import com.likelion.loco_project.domain.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDto getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/recent-reservations")
    public List<DashboardRecentReservationDto> getRecentReservations() {
        return dashboardService.getRecentReservations();
    }

    @GetMapping("/pending-spaces")
    public List<DashboardPendingSpaceDto> getPendingSpaces() {
        return dashboardService.getPendingSpaces();
    }

    @GetMapping("/sales-data")
    public DashboardSalesChartDto getSalesData() {
        return dashboardService.getSalesData();
    }

    @GetMapping("/reservation-stats")
    public DashboardReservationChartDto getReservationStats() {
        return dashboardService.getReservationStats();
    }

    @GetMapping("/space-type-distribution")
    public DashboardSpaceTypeDistributionDto getSpaceTypeDistribution() {
        return dashboardService.getSpaceTypeDistribution();
    }
}