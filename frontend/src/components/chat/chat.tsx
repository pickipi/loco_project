'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatRoomList from './chatroomlist';
import ChatRoom from './chatroom';

/**
 * 메시지 인터페이스
 * @property {string} id - 메시지 고유 ID
 * @property {string} content - 메시지 내용
 * @property {string} sender - 메시지 발신자 ('me' 또는 'other')
 * @property {string} timestamp - 메시지 전송 시간
 * @property {boolean} isEditing - 메시지 수정 모드 여부
 */
interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isEditing?: boolean;
}

/**
 * 채팅방 인터페이스
 * @property {string} id - 채팅방 고유 ID
 * @property {string} name - 채팅방 이름
 * @property {string} lastMessage - 마지막 메시지 내용
 * @property {string} timestamp - 마지막 메시지 시간
 * @property {Message[]} messages - 채팅방의 메시지 목록
 */
interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

/**
 * Chat 컴포넌트 Props 인터페이스
 * @property {ChatRoom[]} initialChatRooms - 초기 채팅방 데이터
 */
interface ChatProps {
  initialChatRooms?: ChatRoom[];
}

/**
 * 채팅 메인 컴포넌트
 * 채팅방 목록과 선택된 채팅방의 메시지를 표시하고 관리합니다.
 */
const Chat: React.FC<ChatProps> = ({ initialChatRooms = [] }) => {
  // 선택된 채팅방 ID 상태
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // 채팅방 목록 상태
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(initialChatRooms);

  /**
   * 채팅방 선택 핸들러
   * @param chatId - 선택된 채팅방 ID
   */
  const handleSelectChat = (chatId: string) => {
    setSelectedRoom(chatId);
  };

  /**
   * 메시지 전송 핸들러
   * @param message - 전송할 메시지 내용
   */
  const handleSendMessage = (message: string) => {
    if (!selectedRoom) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // 채팅방 목록 업데이트: 새 메시지 추가 및 마지막 메시지 정보 갱신
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: [...room.messages, newMessage],
              lastMessage: message,
              timestamp: newMessage.timestamp,
            }
          : room
      )
    );
  };

  /**
   * 메시지 수정 핸들러
   * @param messageId - 수정할 메시지 ID
   * @param newContent - 새로운 메시지 내용
   */
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!selectedRoom) return;

    // 메시지 수정 및 마지막 메시지인 경우 채팅방 정보도 업데이트
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: room.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, content: newContent, isEditing: false }
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
   */
  const handleDeleteMessage = (messageId: string) => {
    if (!selectedRoom) return;

    // 메시지 삭제 및 마지막 메시지 정보 업데이트
    setChatRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== selectedRoom) return room;

        const newMessages = room.messages.filter((msg) => msg.id !== messageId);
        const lastMessage = newMessages[newMessages.length - 1];

        return {
          ...room,
          messages: newMessages,
          lastMessage: lastMessage ? lastMessage.content : '',
          timestamp: lastMessage ? lastMessage.timestamp : room.timestamp,
        };
      })
    );
  };

  // 현재 선택된 채팅방 데이터
  const selectedRoomData = chatRooms.find((room) => room.id === selectedRoom);

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
        {/* 채팅방 목록 */}
        <Box sx={{ width: '300px', height: '100%' }}>
          <ChatRoomList
            chatRooms={chatRooms}
            onSelectChat={handleSelectChat}
          />
        </Box>
        {/* 채팅방 메시지 영역 */}
        <Box sx={{ flex: 1, height: '100%' }}>
          {selectedRoomData ? (
            <ChatRoom
              roomId={selectedRoomData.id}
              roomName={selectedRoomData.name}
              messages={selectedRoomData.messages}
              onSendMessage={handleSendMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
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