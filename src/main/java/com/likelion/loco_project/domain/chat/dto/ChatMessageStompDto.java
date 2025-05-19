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

    private Long messageId;         // 메시지 ID
    private Long senderId;          // 보낸 사람 ID
    private String senderName;      // 보낸 사람 이름
    private String message;         // 메시지 내용
    private LocalDateTime sentAt;   // 보낸 시간
    private boolean isMine;         // 내가 보낸 메시지인지 여부
    private boolean isDeleted;      // 삭제된 메시지인지 여부

    public static ChatMessageStompDto fromEntity(ChatMessage chatMessage, Long currentUserId) {
        // 현재 로그인한 유저가 메시지 보낸 사람인지 확인
        boolean isMine = chatMessage.getSender().getId().equals(currentUserId);
        // soft delete 여부 확인
        boolean isDeleted = chatMessage.isDeleted();

        return ChatMessageStompDto.builder()
                .messageId(chatMessage.getId())
                .senderId(chatMessage.getSender().getId())
                .senderName(chatMessage.getSender().getUsername())
                .message(isDeleted ? "(삭제된 메시지입니다.)" : chatMessage.getMessage())
                .sentAt(chatMessage.getCreatedDate())
                .isMine(isMine)
                .isDeleted(isDeleted)
                .build();
    }
}