package com.likelion.loco_project.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatReadRequestDto {
    private Long chatRoomId;
    private Long messageId;
}