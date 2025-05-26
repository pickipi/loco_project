package com.likelion.loco_project.domain.guestRating.controller;

import com.likelion.loco_project.domain.guestRating.dto.GuestRatingRequestDto;
import com.likelion.loco_project.domain.guestRating.dto.GuestRatingResponseDto;
import com.likelion.loco_project.domain.guestRating.service.GuestRatingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/guest-rating")
@RequiredArgsConstructor
@Slf4j // <- 로그 선언 추가
public class GuestRatingController {

    private final GuestRatingService guestRatingService;

    @PostMapping
    public ResponseEntity<GuestRatingResponseDto> rateGuest(
            @RequestHeader("hostId") Long hostId, // 임시 인증 방식
            @RequestBody GuestRatingRequestDto dto) {
        return ResponseEntity.ok(guestRatingService.rateGuest(hostId, dto));
    }
    //게스트의 평균 평점 열람
    @GetMapping("/average/{guestId}")
    public ResponseEntity<BigDecimal> getAverageRating(@PathVariable Long guestId) {
        log.info("게스트 ID {}의 평균 평점 조회 요청", guestId);
        BigDecimal average = guestRatingService.getAverageRatingForGuest(guestId);
        return ResponseEntity.ok(average);
    }
}
