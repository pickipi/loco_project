package com.likelion.loco_project.domain.chat.service;

import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.repository.BoardRepository;
import com.likelion.loco_project.domain.chat.dto.ChatRoomSummaryDto;
import com.likelion.loco_project.domain.chat.entity.*;
import com.likelion.loco_project.domain.chat.repository.*;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    //챗룸 만들기
    public ChatRoom createOrGetChatRoom(Long boardId, Long guestId) {

        // Board ID로 조회 (아니면 예외 발생)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시판을 찾을 수 없습니다"));

        // 게스트 ID로 조회 (아니면 예외 발생)
        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("게스트를 찾을 수 없습니다"));

        // 게시글 작성자인 Host로부터 연결된 User 엔티티 조회
        User host = board.getHost().getUser();

        // 해당 board, guest, host 조합의 채팅방이 이미 존재하면 반환
        // 없다면 새로 생성 후 저장하고 반환
        return chatRoomRepository.findByBoardAndGuestAndHost(board, guest, host)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.builder()
                            .board(board)
                            .guest(guest)
                            .host(host)
                            .build();
                    return chatRoomRepository.save(newRoom);
                });
    }

    //채팅 목록 조회
    public List<ChatRoomSummaryDto> getMyChatRooms(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 내가 참여 중인 채팅방 전체 가져오기
        List<ChatRoom> rooms = chatRoomRepository.findAllByUser(user);

        return rooms.stream().map(room -> {
                    // 마지막 메시지 조회
                    ChatMessage lastMessage = chatMessageRepository
                            .findTop1ByChatRoomOrderBySendAtDesc(room);

                    // 나 아닌 상대방
                    User other = room.getGuest().equals(user)
                            ? room.getHost()
                            : room.getGuest();

                    //안읽은 메세지 카운트
                    int unreadCount = chatMessageRepository
                            .countByChatRoomAndSenderNotAndIsReadFalse(room, user);

                    return ChatRoomSummaryDto.builder()
                            .chatRoomId(room.getId())
                            .boardTitle(room.getBoard().getTitle())
                            .otherNickname(other.getName())
                            .lastMessage(lastMessage != null ? lastMessage.getMessage() : "(대화 없음)")
                            .lastSentAt(lastMessage != null ? lastMessage.getSendAt() : null)
                            .unreadCount(unreadCount)
                            .build();

                })
                .sorted(Comparator.comparing(ChatRoomSummaryDto::getLastSentAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    // 챗룸 지우기(영구 삭제) 소프트딜리트로도 변경 가능
    public void deleteChatRoom(Long chatRoomId) {
        // 채팅창 ID로 조회 (아니면 예외 발생)
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방(ID: " + chatRoomId + ")을 찾을 수 없습니다."));
        chatRoomRepository.delete(chatRoom);
    }
}