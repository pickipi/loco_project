package com.likelion.loco_project.domain.chat.dto;

import com.likelion.loco_project.domain.chat.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//채팅방 응답 DTO
//채팅방 생성 또는 조회 시 클라이언트에게 전달되는 정보

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponseDto {
    private Long chatRoomId;
    private Long boardId;
    private Long guestId;
    private Long hostId;

    // ChatRoom 엔티티로부터 DTO로 변환하는 정적 팩토리 메서드
    public static ChatRoomResponseDto fromEntity(ChatRoom chatRoom) {
        return ChatRoomResponseDto.builder()
                .chatRoomId(chatRoom.getId())
                .boardId(chatRoom.getBoard().getId())
                .guestId(chatRoom.getGuest().getId())
                .hostId(chatRoom.getHost().getId())
                .build();
    }

}