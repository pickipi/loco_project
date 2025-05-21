package com.likelion.loco_project.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardRecentReservationDto {
    private Long id;
    private String user;
    private String space;
    private String date;
    private String status;
} 