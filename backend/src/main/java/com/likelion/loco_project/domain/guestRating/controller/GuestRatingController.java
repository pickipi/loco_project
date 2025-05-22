package com.likelion.loco_project.domain.guestRating.controller;

import com.likelion.loco_project.domain.guestRating.dto.GuestRatingRequestDto;
import com.likelion.loco_project.domain.guestRating.dto.GuestRatingResponseDto;
import com.likelion.loco_project.domain.guestRating.service.GuestRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/guest-rating")
@RequiredArgsConstructor
public class GuestRatingController {

    private final GuestRatingService guestRatingService;

    @PostMapping
    public ResponseEntity<GuestRatingResponseDto> rateGuest(
            @RequestHeader("hostId") Long hostId, // 임시 인증 방식
            @RequestBody GuestRatingRequestDto dto) {
        return ResponseEntity.ok(guestRatingService.rateGuest(hostId, dto));
    }
}
