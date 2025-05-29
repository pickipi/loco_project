package com.likelion.loco_project.domain.chat.entity;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "chat_messages")
@Setter
@Getter
@AllArgsConstructor(access = PROTECTED)
@NoArgsConstructor(access = PROTECTED)
@SuperBuilder
@ToString(callSuper = true)
public class ChatMessage extends BaseEntity {

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

    // 읽음 표시(카카오톡 1 표시같은거)
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    // 소프트 딜리트
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;
}