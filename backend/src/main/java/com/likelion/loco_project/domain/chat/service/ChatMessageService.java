package com.likelion.loco_project.domain.chat.service;

import com.likelion.loco_project.domain.chat.dto.ChatMessageRequestDto;
import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.chat.repository.ChatMessageRepository;
import com.likelion.loco_project.domain.chat.repository.ChatRoomRepository;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    // 메시지 조회 (시간순 정렬)
    public List<ChatMessage> getMessagesByChatRoom(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        return chatMessageRepository.findByChatRoomOrderBySendAtAsc(chatRoom);
    }

    // 메시지 전송
    public ChatMessage sendMessage(ChatMessageRequestDto dto) {
        // 채팅방 ID로 채팅방 조회 (없으면 예외 발생)
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        // 보낸 사람 ID로 사용자 조회 (없으면 예외 발생)
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("보낸 사용자를 찾을 수 없습니다."));

        // 새로운 채팅 메시지 엔티티 생성
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .message(dto.getMessage())
                .sendAt(LocalDateTime.now())
                .build();

        return chatMessageRepository.save(message);
    }

    // 메세지 수정
    public ChatMessage updateMessage(Long messageId, Long senderId, String newMessage) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("메시지를 찾을 수 없습니다."));

        // 보낸 사람 ID로 수정 권한 (아니면 예외 발생)
        if (!message.getSender().getId().equals(senderId)) {
            throw new RuntimeException("메시지를 수정할 권한이 없습니다.");
        }

        message.setMessage(newMessage);
        return chatMessageRepository.save(message);
    }

    // 안읽은 메세지 표시 (카운팅)
    @Transactional
    public void markMessageAsRead(Long messageId, Long userId) {
        // 채팅창 ID로 조회 (아니면 예외 발생)
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("메시지를 찾을 수 없습니다."));

        if (!message.getSender().getId().equals(userId)) {
            message.setRead(true); //롬북은 isread를 못 읽음
        }
    }

    // 메세지 삭제
    public void deleteMessage(Long messageId, Long senderId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("메시지를 찾을 수 없습니다."));

        // 보낸 사람 ID로 삭제 권한 (아니면 예외 발생)
        if (!message.getSender().getId().equals(senderId)) {
            throw new RuntimeException("메시지를 삭제할 권한이 없습니다.");
        }

        chatMessageRepository.delete(message);
    }
}