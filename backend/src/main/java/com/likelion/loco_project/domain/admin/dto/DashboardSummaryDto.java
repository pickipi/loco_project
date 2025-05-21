package com.likelion.loco_project.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardSummaryDto {
    private long userCount;
    private long spaceCount;
    private long reservationCount;
    private long totalRevenue;
}