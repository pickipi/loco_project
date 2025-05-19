package com.likelion.loco_project.domain.admin.controller;

import com.likelion.loco_project.domain.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/spaces")
@RequiredArgsConstructor
public class AdminController {
    private final SpaceService spaceService;

    // 공간 승인
    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approveSpace(@PathVariable Long id) {
        spaceService.approveSpace(id);
        return ResponseEntity.ok().build();
    }

    // 공간 반려
    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectSpace(@PathVariable Long id, @RequestParam(required = false) String reason) {
        spaceService.rejectSpace(id, reason);
        return ResponseEntity.ok().build();
    }
}
