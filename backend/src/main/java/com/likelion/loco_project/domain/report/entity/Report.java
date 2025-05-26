package com.likelion.loco_project.domain.report.controller;

import com.likelion.loco_project.domain.report.dto.ReportRequestDto;
import com.likelion.loco_project.domain.report.dto.ReportResponseDto;
import com.likelion.loco_project.domain.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/review")
    public ResponseEntity<ReportResponseDto> reportReview(
            @RequestHeader("guestId") Long guestId, // 임시 인증 방식
            @RequestBody ReportRequestDto requestDto) {

        ReportResponseDto response = reportService.reportReview(guestId, requestDto);
        return ResponseEntity.ok(response);
    }
}
