package com.likelion.loco_project.domain.notification.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue
    private Long id;

    private Long receiverId; // 알림 받는 사용자

    private String content; // 알림에 관한 메세지

    @Builder.Default
    private Boolean isRead = false; // 읽지 않으면 빨간 점 표시

    private LocalDateTime createdDate; // 알람 생성 시간

    @Enumerated(EnumType.STRING)
    private NotificationType type; // 예: COMMENT, LIKE, CHAT 등

    //읽음 표시
    public void markAsRead() {
        this.isRead = true;
    }
}
