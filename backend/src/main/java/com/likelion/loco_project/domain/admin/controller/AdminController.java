package com.likelion.loco_project.domain.admin.controller;

import com.likelion.loco_project.domain.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/admin/spaces")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "관리자", description = "관리자 관련 API, 공간 승인/반려")
public class AdminController {
    private final SpaceService spaceService;

    // 공간 승인
    @Operation(summary = "공간 승인", description = "특정 공간 매물을 승인합니다.")
    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approveSpace(@PathVariable Long id) {
        spaceService.approveSpace(id);
        return ResponseEntity.ok().build();
    }

    // 공간 반려
    @Operation(summary = "공간 반려", description = "특정 공간 매물을 반려합니다. 반려 사유를 포함할 수 있습니다.")
    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectSpace(@PathVariable Long id, @RequestParam(required = false) String reason) {
        spaceService.rejectSpace(id, reason);
        return ResponseEntity.ok().build();
    }
}
