package com.likelion.loco_project.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class DashboardSpaceTypeDistributionDto {
    private Map<String, Long> distribution;
} 