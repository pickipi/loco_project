package com.likelion.loco_project.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardPendingSpaceDto {
    private Long id;
    private String name;
    private String owner;
    private String submitted;
} 