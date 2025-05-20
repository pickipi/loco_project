'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatRoomList from './chatroomlist';
import ChatRoomComponent from './chatroom';
import { ChatRoom, ChatRoomData, ChatProps, Message } from '@/types/chat';
import { formatCurrentTime } from '@/utils/dateUtils';

/**
 * 채팅 메인 컴포넌트
 * 채팅방 목록과 선택된 채팅방의 메시지를 표시하고 관리합니다.
 */
const Chat: React.FC<ChatProps> = ({ initialChatRooms = [], currentUserId }) => {
  // 선택된 채팅방 ID 상태
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // 채팅방 목록 상태
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>(initialChatRooms);

  /**
   * 채팅방 선택 핸들러
   * @param chatId - 선택된 채팅방 ID
   */
  const handleSelectChat = (chatId: string) => {
    setSelectedRoom(chatId);
    // 채팅방 선택 시 읽지 않은 메시지 수 초기화
    setChatRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === chatId
          ? { ...room, unreadCount: 0 }
          : room
      )
    );
  };

  /**
   * 메시지 전송 핸들러
   * @param message - 전송할 메시지 내용
   */
  const handleSendMessage = (message: string) => {
    if (!selectedRoom) return;

    const timestamp = formatCurrentTime();

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'me',
      timestamp,
    };

    // 채팅방 목록 업데이트: 새 메시지 추가 및 마지막 메시지 정보 갱신
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: [...room.messages, newMessage],
              lastMessage: message,
              timestamp,
            }
          : room
      )
    );
  };

  /**
   * 메시지 수정 핸들러
   * @param messageId - 수정할 메시지 ID
   * @param newContent - 새로운 메시지 내용
   * @param editedAt - 수정 시간
   */
  const handleEditMessage = (messageId: string, newContent: string, editedAt: string) => {
    if (!selectedRoom) return;

    // 메시지 수정 및 마지막 메시지인 경우 채팅방 정보도 업데이트
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: room.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, content: newContent, isEditing: false, editedAt }
                  : msg
              ),
              lastMessage:
                room.messages[room.messages.length - 1].id === messageId
                  ? newContent
                  : room.lastMessage,
            }
          : room
      )
    );
  };

  /**
   * 메시지 삭제 핸들러
   * @param messageId - 삭제할 메시지 ID
   * @param deletedAt - 삭제 시간
   */
  const handleSoftDelete = (messageId: string, deletedAt: string) => {
    if (!selectedRoom) return;

    // 메시지 소프트 딜리트 처리
    setChatRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== selectedRoom) return room;

        const updatedMessages = room.messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, deletedAt }
            : msg
        );

        // 마지막 메시지가 삭제된 경우 채팅방 정보 업데이트
        const isLastMessageDeleted = room.messages[room.messages.length - 1].id === messageId;
        
        return {
          ...room,
          messages: updatedMessages,
          lastMessage: isLastMessageDeleted ? '삭제된 메시지입니다.' : room.lastMessage,
          timestamp: isLastMessageDeleted ? deletedAt : room.timestamp,
        };
      })
    );
  };

  /**
   * 메시지 수정 취소 핸들러
   */
  const handleCancelEdit = () => {
    if (!selectedRoom) return;

    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: room.messages.map((msg) =>
                msg.isEditing ? { ...msg, isEditing: false } : msg
              ),
            }
          : room
      )
    );
  };

  /**
   * 채팅방 나가기 핸들러
   * @param roomId - 나갈 채팅방 ID
   */
  const handleLeaveRoom = (roomId: string) => {
    setChatRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room => {
        if (room.id !== roomId) return room;

        // 현재 사용자를 participants에서 제거하고 leftParticipants에 추가
        const updatedRoom = {
          ...room,
          participants: room.participants.filter(id => id !== currentUserId),
          leftParticipants: [...room.leftParticipants, currentUserId]
        };

        // 모든 참여자가 나갔다면 채팅방 삭제
        if (updatedRoom.participants.length === 0) {
          return null;
        }

        return updatedRoom;
      }).filter((room): room is ChatRoomData => room !== null);

      // 현재 선택된 채팅방을 나갔다면 선택 해제
      if (selectedRoom === roomId) {
        setSelectedRoom(null);
      }

      return updatedRooms;
    });
  };

  // 현재 선택된 채팅방 데이터
  const selectedRoomData = chatRooms.find((room) => room.id === selectedRoom);

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
        {/* 채팅방 목록 */}
        <Box sx={{ width: '300px', height: '100%' }}>
          <ChatRoomList
            chatRooms={chatRooms.filter(room => 
              room.participants.includes(currentUserId) && 
              !room.leftParticipants.includes(currentUserId)
            )}
            onSelectChat={handleSelectChat}
            onLeaveRoom={handleLeaveRoom}
            currentUserId={currentUserId}
          />
        </Box>
        {/* 채팅방 메시지 영역 */}
        <Box sx={{ flex: 1, height: '100%' }}>
          {selectedRoomData ? (
            <ChatRoomComponent
              roomId={selectedRoomData.id}
              roomName={selectedRoomData.name}
              messages={selectedRoomData.messages}
              onSendMessage={handleSendMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleSoftDelete}
              onCancelEdit={handleCancelEdit}
              onLeaveRoom={handleLeaveRoom}
              currentUserId={currentUserId}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
              }}
            >
              채팅방을 선택해주세요
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat; 