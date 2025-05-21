package com.likelion.loco_project.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class DashboardReservationChartDto {
    private List<String> labels;
    private List<Long> data;
} 