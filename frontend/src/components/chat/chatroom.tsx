'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatEdit from './chatedit';
import ChatDelete from './chatdelete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { extractDate, extractTime, getDateFromTimestamp } from '@/utils/dateUtils';
import { Message } from '@/types/chat';

/**
 * ChatRoom 컴포넌트 Props 인터페이스
 * @property {string} roomId - 채팅방 고유 ID
 * @property {string} roomName - 채팅방 이름
 * @property {Message[]} messages - 채팅방의 메시지 목록
 * @property {function} onSendMessage - 메시지 전송 핸들러
 * @property {function} onEditMessage - 메시지 수정 핸들러
 * @property {function} onDeleteMessage - 메시지 삭제 핸들러
 * @property {function} onCancelEdit - 메시지 수정 취소 핸들러
 * @property {function} onLeaveRoom - 채팅방 나가기 핸들러
 * @property {string} currentUserId - 현재 사용자 ID
 * @property {boolean} isConnected - WebSocket 연결 상태
 */
interface ChatRoomProps {
  roomId: string;
  roomName: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEditMessage: (messageId: string, newContent: string, editedAt: string) => void;
  onDeleteMessage: (messageId: string, deletedAt: string) => void;
  onCancelEdit: () => void;
  onLeaveRoom: (roomId: string) => void;
  currentUserId: string;
  isConnected: boolean;
}

/**
 * 채팅방 컴포넌트
 * 채팅방의 메시지들을 표시하고, 메시지 전송, 수정, 삭제 기능을 제공합니다.
 */
const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  roomName,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onCancelEdit,
  onLeaveRoom,
  currentUserId,
  isConnected,
}) => {
  // 새 메시지 입력값 상태
  const [newMessage, setNewMessage] = useState('');
  // 선택된 메시지 ID (수정/삭제 메뉴 표시용)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // 메시지를 시간순으로 정렬하고 날짜별로 그룹화
  const groupedMessages = React.useMemo(() => {
    // 메시지를 시간순으로 정렬
    const sortedMessages = [...messages].sort((a, b) => {
      const dateA = getDateFromTimestamp(a.timestamp);
      const dateB = getDateFromTimestamp(b.timestamp);
      return dateA.getTime() - dateB.getTime();
    });

    // 날짜별로 그룹화
    return sortedMessages.reduce((groups: { [key: string]: Message[] }, message) => {
      const date = extractDate(message.timestamp);
      if (!date) return groups;
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  /**
   * 메시지 전송 핸들러
   * 입력된 메시지가 있을 경우에만 전송합니다.
   */
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  /**
   * 키 입력 핸들러
   * Enter 키 입력 시 메시지를 전송합니다. (Shift + Enter는 줄바꿈)
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * 메시지 클릭 핸들러
   * 메시지 클릭 시 수정/삭제 메뉴를 토글합니다.
   */
  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 채팅방 헤더 */}
      <Paper elevation={2} sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: '#1976d2' }}>{roomName}</Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#4caf50' : '#f44336'
              }}
            />
          </Box>
          <IconButton
            onClick={() => {
              if (window.confirm('채팅방을 나가시겠습니까?')) {
                onLeaveRoom(roomId);
              }
            }}
            sx={{
              color: '#757575',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                color: '#d32f2f',
              },
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* 메시지 목록 영역 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <React.Fragment key={date}>
            {/* 날짜 구분선 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                my: 2,
              }}
            >
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mx: 2,
                  px: 2,
                  py: 0.5,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                }}
              >
                {date}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* 해당 날짜의 메시지들 */}
            {dateMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  position: 'relative',
                }}
                onClick={() => message.sender === 'me' && !message.isDeleted && handleMessageClick(message.id)}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    backgroundColor: message.isDeleted 
                      ? '#f5f5f5' 
                      : message.sender === 'me' 
                        ? '#1976d2' 
                        : '#f5f5f5',
                    color: message.isDeleted 
                      ? '#9e9e9e' 
                      : message.sender === 'me' 
                        ? 'white' 
                        : 'inherit',
                    cursor: message.sender === 'me' && !message.isDeleted ? 'pointer' : 'default',
                    opacity: message.isDeleted ? 0.7 : 1,
                  }}
                >
                  <Typography variant="body1">
                    {message.isDeleted ? '삭제된 메시지입니다.' : message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: message.sender === 'me' ? 'right' : 'left',
                      color: message.isDeleted 
                        ? '#9e9e9e' 
                        : message.sender === 'me' 
                          ? 'rgba(255, 255, 255, 0.7)' 
                          : 'text.secondary',
                    }}
                  >
                    {message.isDeleted ? '' : `${extractTime(message.timestamp)}${message.editedAt ? ' (수정됨)' : ''}`}
                  </Typography>

                  {/* 수정/삭제 메뉴 */}
                  {selectedMessageId === message.id && message.sender === 'me' && !message.isDeleted && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: '100%',
                      right: 0, 
                      mb: 1,
                      zIndex: 1000
                    }}>
                      <Paper elevation={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Box
                            sx={{
                              p: 1,
                              cursor: 'pointer',
                              '&:hover': { bgcolor: '#e3f2fd' },
                              color: '#1976d2',
                              borderTopLeftRadius: 4,
                              borderTopRightRadius: 4,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              message.isEditing = true;
                              setSelectedMessageId(null);
                            }}
                          >
                            <Typography variant="body2">
                              수정
                            </Typography>
                          </Box>
                          <ChatDelete
                            message={message}
                            onSoftDelete={onDeleteMessage}
                          />
                        </Box>
                      </Paper>
                    </Box>
                  )}
                </Paper>
              </Box>
            ))}
          </React.Fragment>
        ))}
      </Box>

      {/* 메시지 입력/수정 영역 */}
      {messages.find(msg => msg.isEditing) ? (
        <ChatEdit
          message={messages.find(msg => msg.isEditing)!}
          onUpdateMessage={onEditMessage}
          onCancel={onCancelEdit}
        />
      ) : (
        <Box sx={{ p: 2, backgroundColor: '#fff', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{ 
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
                '&.Mui-disabled': {
                  bgcolor: '#e0e0e0',
                  color: '#9e9e9e',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatRoom; 