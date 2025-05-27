package com.likelion.loco_project.domain.guestRating.controller;

import com.likelion.loco_project.domain.guestRating.dto.GuestRatingRequestDto;
import com.likelion.loco_project.domain.guestRating.dto.GuestRatingResponseDto;
import com.likelion.loco_project.domain.guestRating.service.GuestRatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/guest-rating")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "게스트 평점", description = "게스트 평점 관련 API")
public class GuestRatingController {

    private final GuestRatingService guestRatingService;

    @Operation(
        summary = "게스트 평가",
        description = "호스트가 게스트를 평가합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "평가 완료"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "게스트를 찾을 수 없음")
        }
    )
    @PostMapping
    public ResponseEntity<GuestRatingResponseDto> rateGuest(
            @Parameter(description = "평가하는 호스트 ID", required = true)
            @RequestHeader("hostId") Long hostId,
            @Parameter(description = "평가 정보", required = true)
            @RequestBody GuestRatingRequestDto dto) {
        return ResponseEntity.ok(guestRatingService.rateGuest(hostId, dto));
    }

    @Operation(
        summary = "게스트 평균 평점 조회",
        description = "특정 게스트의 평균 평점을 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "평균 평점 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게스트를 찾을 수 없음")
        }
    )
    @GetMapping("/average/{guestId}")
    public ResponseEntity<BigDecimal> getAverageRating(
            @Parameter(description = "평균 평점을 조회할 게스트 ID", required = true)
            @PathVariable Long guestId) {
        log.info("게스트 ID {}의 평균 평점 조회 요청", guestId);
        BigDecimal average = guestRatingService.getAverageRatingForGuest(guestId);
        return ResponseEntity.ok(average);
    }
}
