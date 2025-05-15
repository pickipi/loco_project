package com.likelion.loco_project.domain.guest.controller;

import com.likelion.loco_project.domain.guest.dto.GuestRequestDto;
import com.likelion.loco_project.domain.guest.dto.GuestResponseDto;
import com.likelion.loco_project.domain.guest.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/guests")
@RequiredArgsConstructor
public class ApiV1GuestController {

    private final GuestService guestService;

    @PostMapping
    public ResponseEntity<GuestResponseDto> createGuest(@RequestBody GuestRequestDto dto) {
        GuestResponseDto created = guestService.createGuest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestResponseDto> getGuest(@PathVariable Long id) {
        return ResponseEntity.ok(guestService.getGuest(id));
    }
}