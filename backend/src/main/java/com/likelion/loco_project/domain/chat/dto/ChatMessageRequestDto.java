package com.likelion.loco_project.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequestDto {

    private Long chatRoomId;   // 메시지를 보낼 채팅방 ID
    private Long senderId;     // 메시지를 보낸 사용자 ID
    private String message;    // 메시지 본문
}