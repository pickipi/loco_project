package com.likelion.loco_project.domain.chat.dto;

import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//채팅 메시지 응답 DTO
//클라이언트에게 채팅 메시지를 전달할 때 사용하는 데이터 구조

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponseDto {

    private Long messageId; // 메시지 아이디
    private Long chatRoomId; // 채팅룸 아이디
    private Long senderId; // 보낸 사람의 아이디
    private String senderName; // 보낸 사람의 이름
    private String message; // 메시지
    private LocalDateTime sentAt; //보낸시간


    //    ChatMessage 엔티티를 DTO로 변환하는 정적 팩토리
    public static ChatMessageResponseDto fromEntity(ChatMessage message) {
        return ChatMessageResponseDto.builder()
                .messageId(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getUsername())
                .message(message.getMessage())
                .sentAt(message.getCreatedDate())
                .build();
    }
}