package com.likelion.loco_project.domain.chat.controller;

import com.likelion.loco_project.domain.chat.dto.*;
import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.chat.service.ChatMessageService;
import com.likelion.loco_project.domain.chat.service.ChatRoomService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "채팅", description = "채팅 관련 API, 채팅방 생성 / 조회 / 메시지 전송 / 삭제 / 읽음 처리")
public class ApiV1ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    // 전체 채팅방 미리보기
    @Operation(summary = "내 채팅방 목록 조회"
            , description = "특정 사용자 ID로 내가 참여한 채팅방 리스트를 조회합니다.")
    @GetMapping("/my/chatrooms")
    public ResponseEntity<RsData<List<ChatRoomSummaryDto>>> getMyChatRooms(@RequestParam Long userId) {
        List<ChatRoomSummaryDto> result = chatRoomService.getMyChatRooms(userId);
        return ResponseEntity.ok(RsData.of("S-200", "내 채팅방 목록 조회 성공", result));
    }

    // 채팅방 생성
    @Operation(summary = "채팅방 생성"
            , description = "게시글 ID와 게스트 ID로 기존 채팅방을 조회하거나 없으면 새로 생성합니다.")
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
    @Operation(summary = "채팅방 메시지 조회"
            , description = "해당 채팅방의 모든 메시지를 시간순으로 조회합니다.")
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
    @Operation(summary = "메시지 전송 (REST)"
            , description = "지정된 채팅방에 메시지를 전송합니다.")
    @PostMapping("/chatrooms/{chatRoomId}/messages")
    public ResponseEntity<RsData<ChatMessageResponseDto>> sendMessage(
            @RequestBody ChatMessageRequestDto requestDto) {

        ChatMessage saved = chatMessageService.sendMessage(requestDto);
        ChatMessageResponseDto responseDto = ChatMessageResponseDto.fromEntity(saved);

        return ResponseEntity.ok(RsData.of("S-200", "메시지 전송 성공", responseDto));
    }

    // 메시지 삭제
    @Operation(summary = "메시지 삭제"
            , description = "본인이 보낸 메시지를 삭제합니다.")
    @DeleteMapping("/chatrooms/{chatRoomId}/messages/{messageId}")
    public ResponseEntity<RsData<Void>> deleteMessage(
            @PathVariable Long chatRoomId,
            @PathVariable Long messageId,
            @RequestParam Long senderId) {

        chatMessageService.deleteMessage(chatRoomId,messageId, senderId);
        return ResponseEntity.ok(RsData.of("S-200", "메시지 삭제 성공"));
    }

    // 메시지 읽음 처리
    @Operation(summary = "메시지 읽음 처리"
            , description = "특정 메시지를 읽음 처리합니다.")
    @PatchMapping("/chatrooms/{chatRoomId}/messages/{messageId}/read")
    public ResponseEntity<RsData<Void>> markAsRead(
            @PathVariable Long messageId,
            @RequestParam Long userId) {

        chatMessageService.markMessageAsRead(messageId, userId);
        return ResponseEntity.ok(RsData.of("S-200", "메시지 읽음 처리 완료"));
    }
}