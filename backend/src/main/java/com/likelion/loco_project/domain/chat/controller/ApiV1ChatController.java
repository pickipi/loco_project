package com.likelion.loco_project.domain.chat.controller;

import com.likelion.loco_project.domain.chat.dto.*;
import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.chat.service.ChatMessageService;
import com.likelion.loco_project.domain.chat.service.ChatRoomService;
import com.likelion.loco_project.global.rsData.RsData;
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
    public ResponseEntity<RsData<List<ChatRoomSummaryDto>>> getMyChatRooms(@RequestParam Long userId) {
        List<ChatRoomSummaryDto> result = chatRoomService.getMyChatRooms(userId);
        return ResponseEntity.ok(RsData.of("S-200", "내 채팅방 목록 조회 성공", result));
    }

    // 채팅방 생성 or 조회
    @PostMapping("/boards/{boardId}/chatrooms")
    public ResponseEntity<RsData<ChatRoomResponseDto>> createOrGetChatRoom(
            @PathVariable Long boardId,
            @RequestBody ChatRoomRequestDto requestDto) {

        ChatRoom chatRoom = chatRoomService.createOrGetChatRoom(
                requestDto.getBoardId(),
                requestDto.getGuestId()
        );

        ChatRoomResponseDto response = ChatRoomResponseDto.fromEntity(chatRoom);
        return ResponseEntity.ok(RsData.of("S-200", "채팅방 생성 또는 조회 성공", response));
    }

    // 채팅방 내 메시지 조회
    @GetMapping("/chatrooms/{chatRoomId}/messages")
    public ResponseEntity<RsData<List<ChatMessageResponseDto>>> getMessagesByChatRoom(
            @PathVariable Long chatRoomId) {

        List<ChatMessage> messages = chatMessageService.getMessagesByChatRoom(chatRoomId);
        List<ChatMessageResponseDto> response = messages.stream()
                .map(ChatMessageResponseDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(RsData.of("S-200", "채팅 메시지 목록 조회 성공", response));
    }

    // 메시지 전송
    @PostMapping("/chatrooms/{chatRoomId}/messages")
    public ResponseEntity<RsData<ChatMessageResponseDto>> sendMessage(
            @RequestBody ChatMessageRequestDto requestDto) {

        ChatMessage saved = chatMessageService.sendMessage(requestDto);
        ChatMessageResponseDto responseDto = ChatMessageResponseDto.fromEntity(saved);

        return ResponseEntity.ok(RsData.of("S-200", "메시지 전송 성공", responseDto));
    }

    // 메시지 삭제
    @DeleteMapping("/chatrooms/{chatRoomId}/messages/{messageId}")
    public ResponseEntity<RsData<Void>> deleteMessage(
            @PathVariable Long messageId,
            @RequestParam Long senderId) {

        chatMessageService.deleteMessage(messageId, senderId);
        return ResponseEntity.ok(RsData.of("S-200", "메시지 삭제 성공"));
    }

    // 메시지 읽음 처리
    @PatchMapping("/chatrooms/{chatRoomId}/messages/{messageId}/read")
    public ResponseEntity<RsData<Void>> markAsRead(
            @PathVariable Long messageId,
            @RequestParam Long userId) {

        chatMessageService.markMessageAsRead(messageId, userId);
        return ResponseEntity.ok(RsData.of("S-200", "메시지 읽음 처리 완료"));
    }

    // 채팅방 삭제
    @DeleteMapping("/chatrooms/{chatRoomId}")
    public ResponseEntity<RsData<Void>> deleteChatRoom(@PathVariable Long chatRoomId) {
        chatRoomService.deleteChatRoom(chatRoomId);
        return ResponseEntity.ok(RsData.of("S-200", "채팅방 삭제 성공"));
    }
}