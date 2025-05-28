package com.likelion.loco_project.domain.report.controller;

import com.likelion.loco_project.domain.report.dto.ReportRequestDto;
import com.likelion.loco_project.domain.report.dto.ReportResponseDto;
import com.likelion.loco_project.domain.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/report")
@RequiredArgsConstructor
@Tag(name = "신고 관리", description = "리뷰 신고 관련 API")
public class ReportController {

    private final ReportService reportService;

    @Operation(
        summary = "리뷰 신고",
        description = "특정 리뷰를 신고합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "신고 접수 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
        }
    )
    @PostMapping("/review")
    public ResponseEntity<ReportResponseDto> reportReview(
            @Parameter(description = "신고하는 게스트 ID", required = true)
            @RequestHeader("guestId") Long guestId,
            @Parameter(description = "신고 정보", required = true)
            @RequestBody ReportRequestDto requestDto) {

        ReportResponseDto response = reportService.reportReview(guestId, requestDto);
        return ResponseEntity.ok(response);
    }
}
