package com.likelion.loco_project.domain.notification.controller;

import com.likelion.loco_project.domain.notification.dto.NotificationResponseDto;
import com.likelion.loco_project.domain.notification.dto.NotificationSettingResponseDto;
import com.likelion.loco_project.domain.notification.entity.NotificationType;
import com.likelion.loco_project.domain.notification.service.NotificationService;
import com.likelion.loco_project.domain.notification.service.NotificationSettingService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
@Tag(name = "알림", description = "알림 관련 API, 알림 조회 / 읽음 처리 / 전체 읽음 처리 / 삭제")
public class ApiV1NotificationController {
    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;

    // 알림 목록
    @Operation(summary = "내 알림 목록 조회")
    @GetMapping
    public ResponseEntity<RsData<List<NotificationResponseDto>>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = Long.parseLong(userDetails.getUsername());
        List<NotificationResponseDto> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(RsData.of("S-1", "알림 조회 성공", notifications));
    }

    // 알림 단건
    @Operation(summary = "알림 단건 읽음 처리")
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<RsData<Void>> readNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(RsData.of("S-2", "읽음 처리 완료"));
    }

    //알림 읽음
    @Operation(summary = "알림 전체 읽음 처리")
    @PostMapping("/read-all")
    public ResponseEntity<RsData<Void>> readAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(RsData.of("S-3", "전체 읽음 처리 완료"));
    }

    // 알림 삭제
    @Operation(summary = "알림 삭제")
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<RsData<Void>> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.ok(RsData.of("S-4", "알림 삭제 완료"));
    }

    // 알림 설정 조회
    @Operation(summary = "알림 설정 조회")
    @GetMapping("/settings")
    public ResponseEntity<RsData<NotificationSettingResponseDto>> getNotificationSettings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = Long.parseLong(userDetails.getUsername());
        NotificationSettingResponseDto settings = notificationSettingService.getSettingsForUser(userId);
        return ResponseEntity.ok(RsData.of("S-1", "알림 설정 조회 성공", settings));
    }

    //테스트용 알림
    @PostMapping("/test-notify/{receiverId}")
    public void testNotify(@PathVariable("receiverId") Long receiverId) {
        notificationService.notifyUser(receiverId, "테스트 알림입니다.", NotificationType.COMMENT);
    }
}
