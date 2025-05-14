package com.likelion.loco_project.domain.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatRoomSummaryDto {
    private Long chatRoomId;
    private String boardTitle;
    private String otherNickname;
    private String lastMessage;
    private LocalDateTime lastSentAt;
    private int unreadCount;
    private boolean otherExited;// 채팅방에 남아 있는 유저
}