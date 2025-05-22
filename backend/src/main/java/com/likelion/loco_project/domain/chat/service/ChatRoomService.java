package com.likelion.loco_project.domain.chat.service;

import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.repository.BoardRepository;
import com.likelion.loco_project.domain.chat.dto.ChatRoomSummaryDto;
import com.likelion.loco_project.domain.chat.entity.*;
import com.likelion.loco_project.domain.chat.repository.*;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    //챗룸 만들기
    public ChatRoom createOrGetChatRoom(Long boardId, Long guestId) {

        // 필요한 엔티티들을 조회
        ChatRoomEntities entities = getChatRoomEntities(boardId, guestId);
        Board board = entities.board;
        User guest = entities.guest;
        User host = entities.host;

        // 작성자가 자기와 채팅하는 걸 방지
        if (guest.getId().equals(host.getId())) {
            throw new RuntimeException("자기 자신과는 채팅할 수 없습니다.");
        }

        // 기존 채팅방 존재 여부 확인
        Optional<ChatRoom> optionalRoom = chatRoomRepository.findByBoardAndGuestAndHost(board, guest, host);

        if (optionalRoom.isPresent()) {
            ChatRoom room = optionalRoom.get();

            // 재입장 처리: 나간 사용자면 상태 복구
            if (guest.equals(room.getGuest())) {
                room.setGuestExited(false);
            } else {
                room.setHostExited(false);
            }
            return room;
        }

        // 새로 생성
        ChatRoom newRoom = ChatRoom.builder()
                .board(board)
                .guest(guest)
                .host(host)
                .build();

        return chatRoomRepository.save(newRoom);
    }

    // 채팅방 생성에 필요한 엔티티들을 조회하고 반환하는 내부 클래스 및 메서드
    private static class ChatRoomEntities {
        Board board;
        User guest;
        User host;

        ChatRoomEntities(Board board, User guest, User host) {
            this.board = board;
            this.guest = guest;
            this.host = host;
        }
    }

    private ChatRoomEntities getChatRoomEntities(Long boardId, Long guestId) {
        // Board ID로 조회 (아니면 예외 발생)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시판을 찾을 수 없습니다"));

        // 게스트 ID로 조회 (아니면 예외 발생)
        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("게스트를 찾을 수 없습니다"));

        // 게시글 작성자인 Host로부터 연결된 User 엔티티 조회
        User host = board.getHost().getUser();

        return new ChatRoomEntities(board, guest, host);
    }

    //채팅 목록 조회
    public List<ChatRoomSummaryDto> getMyChatRooms(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 내가 참여 중인 채팅방 전체 가져오기
        List<ChatRoom> rooms = chatRoomRepository.findAllByUserWithDetails(user);

        // 마지막 메시지들을 한 번에 조회
        List<ChatMessage> lastMessages = chatMessageRepository.findLastMessagesByChatRooms(rooms);

        // 채팅방 ID를 key로, 마지막 메시지를 value로 매핑 (빠른 참조용)
        Map<Long, ChatMessage> roomIdToLastMessage = lastMessages.stream()
                .collect(Collectors.toMap(m -> m.getChatRoom().getId(), Function.identity()));


        return rooms.stream()
                .filter(room -> {
                    // 나간 채팅방 필터링: 내가 guest 또는 host로 나간 상태면 제외
                    if (room.getGuest().equals(user)) return !room.isGuestExited();
                    if (room.getHost().equals(user)) return !room.isHostExited();
                    return false;
                })
                // 각 채팅방을 ChatRoomSummaryDto로 변환
                .map(room -> {
                    ChatMessage lastMessage = roomIdToLastMessage.get(room.getId());
                    // 상대방 구하기 (내가 guest면 상대는 host, 반대도 마찬가지)
                    User other = room.getGuest().equals(user) ? room.getHost() : room.getGuest();
                    // 내가 안 읽은 메시지 개수
                    int unreadCount = chatMessageRepository.countByChatRoomAndSenderNotAndIsReadFalse(room, user);
                    // 채팅룸에서 누군가 한명있으면 유지
                    boolean otherExited = room.getGuest().equals(user)
                            ? room.isHostExited()
                            : room.isGuestExited();
                    // 요약 DTO 생성
                    return ChatRoomSummaryDto.builder()
                            .chatRoomId(room.getId())
                            .boardTitle(room.getBoard().getTitle())
                            .otherNickname(other.getUsername())
                            .lastMessage(lastMessage != null ? lastMessage.getMessage() : "(대화 없음)")
                            .lastSentAt(lastMessage != null ? lastMessage.getCreatedDate() : null)
                            .unreadCount(unreadCount)
                            .otherExited(otherExited)
                            .build();
                })
                // 마지막 메시지 시간 기준으로 정렬 (최신 순, null은 맨 뒤)
                .sorted(Comparator.comparing(ChatRoomSummaryDto::getLastSentAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }


    // 채팅방 나가기
    @Transactional
    public void exitChatRoom(Long chatRoomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        // 채팅방 멤버 유지
        boolean isGuest = room.getGuest().getId().equals(userId);
        boolean isHost = room.getHost().getId().equals(userId);

        // 누가 나갔는지를 알기 위해서 나눔
        if (isGuest) {
            room.setGuestExited(true);
        } else if (isHost) {
            room.setHostExited(true);
        } else {
            throw new AccessDeniedException("해당 채팅방에 속하지 않은 사용자입니다.");
        }

        // 둘 다 나갔다면 채팅방 하드 삭제
        if (room.isGuestExited() && room.isHostExited()) {
            chatRoomRepository.delete(room);
        }
    }
}