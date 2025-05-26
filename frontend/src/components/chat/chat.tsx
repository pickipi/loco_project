'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SockJS from 'sockjs-client';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import ChatRoomList from './chatroomlist';
import ChatRoomComponent from './chatroom';
import { ChatRoom, ChatRoomData, ChatProps, Message } from '@/types/chat';
import { formatCurrentTime } from '@/utils/dateUtils';
import api from '@/lib/axios';

/**
 * 채팅 메인 컴포넌트
 * 채팅방 목록과 선택된 채팅방의 메시지를 표시하고 관리합니다.
 */
const Chat: React.FC<ChatProps> = ({ initialChatRooms = [], currentUserId }) => {
  // 선택된 채팅방 ID 상태
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // 채팅방 목록 상태
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>(initialChatRooms);
  // WebSocket 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  // STOMP 클라이언트 참조
  const stompClient = React.useRef<Client | null>(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket 연결됨');
        setIsConnected(true);

        // 사용자의 모든 채팅방 구독
        chatRooms.forEach(room => {
          client.subscribe(`/topic/chat/${room.id}`, (message: StompMessage) => {
            try {
              const chatMessage: Message = JSON.parse(message.body);
              handleIncomingMessage(room.id, chatMessage);
            } catch (error) {
              console.error('메시지 파싱 실패:', error);
            }
          });
        });

        // 새 채팅방 생성 구독
        client.subscribe(`/topic/chat/rooms/${currentUserId}`, (message: StompMessage) => {
          try {
            const newRoom: ChatRoomData = JSON.parse(message.body);
            handleNewChatRoom(newRoom);
          } catch (error) {
            console.error('새 채팅방 파싱 실패:', error);
          }
        });
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 끊김');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame.body);
        setIsConnected(false);
      }
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [currentUserId]);

  /**
   * 새로운 채팅방 처리 핸들러
   */
  const handleNewChatRoom = (newRoom: ChatRoomData) => {
    setChatRooms(prev => [...prev, newRoom]);
    
    // 새 채팅방 구독
    if (stompClient.current?.active) {
      stompClient.current.subscribe(`/topic/chat/${newRoom.id}`, (message: StompMessage) => {
        try {
          const chatMessage: Message = JSON.parse(message.body);
          handleIncomingMessage(newRoom.id, chatMessage);
        } catch (error) {
          console.error('메시지 파싱 실패:', error);
        }
      });
    }
  };

  /**
   * 수신된 메시지 처리 핸들러
   */
  const handleIncomingMessage = (roomId: string, message: Message) => {
    setChatRooms(prevRooms => 
      prevRooms.map(room => {
        if (room.id !== roomId) return room;

        // 현재 선택된 채팅방이 아닌 경우 읽지 않은 메시지 수 증가
        const unreadCount = room.id === selectedRoom ? 0 : (room.unreadCount || 0) + 1;

        return {
          ...room,
          messages: [...room.messages, message],
          lastMessage: message.content,
          timestamp: message.timestamp,
          unreadCount
        };
      })
    );
  };

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

    // 서버에 읽음 상태 업데이트
    if (stompClient.current?.active) {
      stompClient.current.publish({
        destination: `/app/chat/${chatId}/read`,
        body: JSON.stringify({ userId: currentUserId })
      });
    }
  };

  /**
   * 메시지 전송 핸들러
   * @param content - 전송할 메시지 내용
   */
  const handleSendMessage = (content: string) => {
    if (!selectedRoom || !stompClient.current?.active) return;

    const message = {
      content,
      sender: currentUserId,
      timestamp: formatCurrentTime()
    };

    // 메시지 전송
    stompClient.current.publish({
      destination: `/app/chat/${selectedRoom}/message`,
      body: JSON.stringify(message)
    });
  };

  /**
   * 메시지 수정 핸들러
   * @param messageId - 수정할 메시지 ID
   * @param newContent - 새로운 메시지 내용
   * @param editedAt - 수정 시간
   */
  const handleEditMessage = async (messageId: string, newContent: string, editedAt: string) => {
    if (!selectedRoom || !stompClient.current?.active) return;

    const editMessage = {
      messageId,
      content: newContent,
      editedAt
    };

    // 메시지 수정 요청
    stompClient.current.publish({
      destination: `/app/chat/${selectedRoom}/edit`,
      body: JSON.stringify(editMessage)
    });

    // 로컬 상태 업데이트
    setChatRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: room.messages.map(msg =>
                msg.id === messageId
                  ? { ...msg, content: newContent, isEditing: false, editedAt }
                  : msg
              ),
              lastMessage: room.messages[room.messages.length - 1].id === messageId
                ? newContent
                : room.lastMessage
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
  const handleSoftDelete = async (messageId: string, deletedAt: string) => {
    if (!selectedRoom || !stompClient.current?.active) return;

    const deleteMessage = {
      messageId,
      deletedAt
    };

    // 메시지 삭제 요청
    stompClient.current.publish({
      destination: `/app/chat/${selectedRoom}/delete`,
      body: JSON.stringify(deleteMessage)
    });

    // 로컬 상태 업데이트
    setChatRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id !== selectedRoom) return room;

        const updatedMessages = room.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, deletedAt }
            : msg
        );

        const isLastMessageDeleted = room.messages[room.messages.length - 1].id === messageId;

        return {
          ...room,
          messages: updatedMessages,
          lastMessage: isLastMessageDeleted ? '삭제된 메시지입니다.' : room.lastMessage,
          timestamp: isLastMessageDeleted ? deletedAt : room.timestamp
        };
      })
    );
  };

  /**
   * 메시지 수정 취소 핸들러
   */
  const handleCancelEdit = () => {
    if (!selectedRoom) return;

    setChatRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: room.messages.map(msg =>
                msg.isEditing ? { ...msg, isEditing: false } : msg
              )
            }
          : room
      )
    );
  };

  /**
   * 채팅방 나가기 핸들러
   * @param roomId - 나갈 채팅방 ID
   */
  const handleLeaveRoom = async (roomId: string) => {
    if (!stompClient.current?.active) return;

    // 채팅방 나가기 요청
    stompClient.current.publish({
      destination: `/app/chat/${roomId}/leave`,
      body: JSON.stringify({ userId: currentUserId })
    });

    // 구독 해제
    stompClient.current.unsubscribe(`/topic/chat/${roomId}`);

    // 로컬 상태 업데이트
    setChatRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room => {
        if (room.id !== roomId) return room;

        const updatedRoom = {
          ...room,
          participants: room.participants.filter(id => id !== currentUserId),
          leftParticipants: [...room.leftParticipants, currentUserId]
        };

        return updatedRoom.participants.length === 0 ? null : updatedRoom;
      }).filter((room): room is ChatRoomData => room !== null);

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
              isConnected={isConnected}
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