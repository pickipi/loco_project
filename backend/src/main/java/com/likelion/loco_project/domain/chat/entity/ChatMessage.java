package com.likelion.loco_project.domain.chat.entity;

import com.likelion.loco_project.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 채팅방
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id", nullable = false)
    private ChatRoom chatRoom;

    // 누가 보냈는지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // 메시지 내용
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    // 보낸 시간
    @Column(name = "send_at", nullable = false)
    private LocalDateTime sendAt;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

}