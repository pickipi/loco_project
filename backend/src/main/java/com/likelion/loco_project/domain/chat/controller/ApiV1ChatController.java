package com.likelion.loco_project.domain.chat.controller;

import com.likelion.loco_project.domain.chat.dto.*;
import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.chat.service.ChatMessageService;
import com.likelion.loco_project.domain.chat.service.ChatRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ApiV1ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    // 전체 채팅방 미리보기
    @GetMapping("/my/chatrooms")
    public ResponseEntity<List<ChatRoomSummaryDto>> getMyChatRooms(@RequestParam Long userId) {
        return ResponseEntity.ok(chatRoomService.getMyChatRooms(userId));
    }

    // 채팅방 생성 or 조회
    @PostMapping("/boards/{boardId}/chatrooms")
    public ResponseEntity<ChatRoomResponseDto> createOrGetChatRoom(
            @PathVariable Long boardId,
            @RequestBody ChatRoomRequestDto requestDto) {

        ChatRoom chatRoom = chatRoomService.createOrGetChatRoom(
                requestDto.getBoardId(),
                requestDto.getGuestId()
        );

        return ResponseEntity.ok(ChatRoomResponseDto.fromEntity(chatRoom));
    }

    //채팅방 내 메시지 조회
    @GetMapping("/chatrooms/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessageResponseDto>> getMessagesByChatRoom(
            @PathVariable Long chatRoomId) {

        List<ChatMessage> messages = chatMessageService.getMessagesByChatRoom(chatRoomId);

        List<ChatMessageResponseDto> response = messages.stream()
                .map(ChatMessageResponseDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // 메시지 전송
    @PostMapping("/chatrooms/{chatRoomId}/messages")
    public ResponseEntity<ChatMessageResponseDto> sendMessage(
            @RequestBody ChatMessageRequestDto requestDto) {

        ChatMessage saved = chatMessageService.sendMessage(requestDto);

        return ResponseEntity.ok(ChatMessageResponseDto.fromEntity(saved));
    }

    // 메세지 수정
    @PutMapping("chatrooms/{chatRoomId}/messages/{messageId}")
    public ResponseEntity<ChatMessageResponseDto> editedMessage(
            @Valid @PathVariable Long messageId,
            @RequestBody ChatMessageUpdateRequestDto dto) {

        ChatMessage updated = chatMessageService
                .updateMessage(messageId, dto.getSenderId(), dto.getMessage());
        return ResponseEntity.ok(ChatMessageResponseDto.fromEntity(updated));
    }

    // 메세지 삭제
    @DeleteMapping("chatrooms/{chatRoomId}/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId,
            @RequestParam Long senderId) {

        chatMessageService.deleteMessage(messageId, senderId);
        return ResponseEntity.noContent().build();
    }

    //메세지 읽음 안읽음 표시
    @PatchMapping("/chatrooms/{chatRoomId}/messages/{messageId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long messageId,
            @RequestParam Long userId) {

        chatMessageService.markMessageAsRead(messageId, userId);
        return ResponseEntity.noContent().build(); // HTTP 204
    }

    // 챗룸 삭제
    @DeleteMapping("/chatrooms/{chatRoomId}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable Long chatRoomId) {
        chatRoomService.deleteChatRoom(chatRoomId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}