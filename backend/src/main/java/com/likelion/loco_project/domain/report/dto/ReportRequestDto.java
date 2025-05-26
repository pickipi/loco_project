package com.likelion.loco_project.domain.report.dto;

import com.likelion.loco_project.domain.report.entity.ReportReason;
import lombok.Getter;

@Getter
public class ReportRequestDto {
    private Long reviewId;
    private ReportReason reason;
    private String detail;
}
