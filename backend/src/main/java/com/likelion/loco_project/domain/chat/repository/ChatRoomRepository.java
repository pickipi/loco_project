package com.likelion.loco_project.domain.chat.repository;

import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import com.likelion.loco_project.domain.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // 게시판안에 호스트와 게스트의 1:1 채팅
    @EntityGraph(attributePaths = {"board", "guest", "host"})
    Optional<ChatRoom> findByBoardAndGuestAndHost(Board board, User guest, User host);

    // 내가 속한 채팅방들 + 게시글(post)까지 fetch
    @Query("SELECT r FROM ChatRoom r " +
            "LEFT JOIN FETCH r.board " +
            "WHERE r.guest = :user " +
            "OR r.host = :user")
    List<ChatRoom> findAllByUser(@Param("user") User user);


}
