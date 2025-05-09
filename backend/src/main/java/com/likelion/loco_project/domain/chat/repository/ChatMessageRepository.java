package com.likelion.loco_project.domain.chat.repository;

import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
        // 특정 채팅방의 메시지를 시간순으로 조회
        @EntityGraph(attributePaths = {"sender", "chatRoom"})
        List<ChatMessage> findByChatRoomOrderBySendAtAsc(ChatRoom chatRoom);

        //최신 메세지 미리보기
        ChatMessage findTop1ByChatRoomOrderBySendAtDesc(ChatRoom chatRoom);

        // 내가 아닌 사용자가 보낸 읽지 않은 메시지 수
        int countByChatRoomAndSenderNotAndIsReadFalse(ChatRoom chatRoom, User me);
}
