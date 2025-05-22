package com.likelion.loco_project.domain.chat.repository;

import com.likelion.loco_project.domain.chat.entity.ChatMessage;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // 특정 채팅방의 메시지를 시간순으로 조회
    @EntityGraph(attributePaths = {"sender", "chatRoom"})
    List<ChatMessage> findByChatRoomOrderByCreatedDateAsc(ChatRoom chatRoom);

    //최신 메세지 미리보기
    ChatMessage findTop1ByChatRoomOrderByCreatedDateDesc(ChatRoom chatRoom);

    // 내가 아닌 사용자가 보낸 읽지 않은 메시지 수
    int countByChatRoomAndSenderNotAndIsReadFalse(ChatRoom chatRoom, User me);

    @Query("""
    SELECT m FROM ChatMessage m
    WHERE m.id IN (
        SELECT MAX(m2.id)
        FROM ChatMessage m2
        WHERE m2.chatRoom IN :chatRooms
        GROUP BY m2.chatRoom
    )
""")
    @EntityGraph(attributePaths = {"sender", "chatRoom"})
    List<ChatMessage> findLastMessagesByChatRooms(@Param("chatRooms") List<ChatRoom> chatRooms);
}