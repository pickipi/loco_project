package com.likelion.loco_project.domain.notification.dto;

import com.likelion.loco_project.domain.notification.entity.Notification;
import com.likelion.loco_project.domain.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class NotificationResponseDto {

    private Long id;
    private String content;
    private boolean isRead;
    private NotificationType type;
    private LocalDateTime createdDate;

    public static NotificationResponseDto fromEntity(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .type(notification.getType())
                .createdDate(notification.getCreatedDate())
                .build();
    }
}