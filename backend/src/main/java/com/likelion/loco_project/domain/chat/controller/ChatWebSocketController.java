package com.likelion.loco_project.domain.chat.controller;

import com.likelion.loco_project.domain.chat.dto.ChatMessageRequestDto;
import com.likelion.loco_project.domain.chat.dto.ChatMessageStompDto;
import com.likelion.loco_project.domain.chat.dto.ChatReadRequestDto;
import com.likelion.loco_project.domain.chat.dto.ChatReadStompDto;
import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.service.ChatMessageService;
import com.likelion.loco_project.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    // 실시간 메시지 전송 처리
    @MessageMapping("/chat.send")
    public void handleStompMessage(@Payload ChatMessageRequestDto dto,
                                   @Header("simpSessionAttributes") Map<String, Object> sessionAttributes) {

        User user = (User) sessionAttributes.get("user");

        if (user == null) {
            throw new RuntimeException("인증된 사용자만 채팅이 가능합니다.");
        }

        dto.setSenderId(user.getId()); // 서버에서 인증된 사용자로 덮어씀
        ChatMessage saved = chatMessageService.sendMessage(dto);

        ChatMessageStompDto response = ChatMessageStompDto.fromEntity(saved, user.getId());
        String destination = "/topic/chatroom." + dto.getChatRoomId();
        messagingTemplate.convertAndSend(destination, response);
    }

    // 실시간 읽음 처리 전파
    @MessageMapping("/chat.read")
    public void handleReadMessage(@Payload ChatReadRequestDto dto,
                                  @Header("simpSessionAttributes") Map<String, Object> sessionAttributes) {

        User user = (User) sessionAttributes.get("user");
        chatMessageService.markMessageAsRead(dto.getMessageId(), user.getId());

        ChatReadStompDto readDto = new ChatReadStompDto(dto.getMessageId(), user.getId());
        String destination = "/topic/chatroom." + dto.getChatRoomId() + ".read";
        messagingTemplate.convertAndSend(destination, readDto);
    }
}
