package com.likelion.loco_project.domain.chat.dto;

import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageStompDto {

    private Long messageId;      // 메시지 ID
    private String senderName;   // 보낸 사람 이름
    private String message;      // 메시지 내용
    private LocalDateTime sentAt; // 보낸 시간

    public static ChatMessageStompDto fromEntity(ChatMessage chatMessage) {
        return ChatMessageStompDto.builder()
                .messageId(chatMessage.getId())
                .senderName(chatMessage.getSender().getUsername())
                .message(chatMessage.getMessage())
                .sentAt(chatMessage.getCreatedDate()) // BaseEntity에서 상속
                .build();
    }
}