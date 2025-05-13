'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatEdit from './chatedit';
import ChatDelete from './chatdelete';

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
 * ChatRoom 컴포넌트 Props 인터페이스
 * @property {string} roomId - 채팅방 고유 ID
 * @property {string} roomName - 채팅방 이름
 * @property {Message[]} messages - 채팅방의 메시지 목록
 * @property {function} onSendMessage - 메시지 전송 핸들러
 * @property {function} onEditMessage - 메시지 수정 핸들러
 * @property {function} onDeleteMessage - 메시지 삭제 핸들러
 */
interface ChatRoomProps {
  roomId: string;
  roomName: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
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
}) => {
  // 새 메시지 입력값 상태
  const [newMessage, setNewMessage] = useState('');
  // 선택된 메시지 ID (수정/삭제 메뉴 표시용)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

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
        <Typography variant="h6" sx={{ color: '#1976d2' }}>{roomName}</Typography>
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
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              position: 'relative',
            }}
            onClick={() => message.sender === 'me' && handleMessageClick(message.id)}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1,
                backgroundColor: message.sender === 'me' ? '#1976d2' : '#f5f5f5',
                color: message.sender === 'me' ? 'white' : 'inherit',
                cursor: message.sender === 'me' ? 'pointer' : 'default',
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: message.sender === 'me' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              >
                {message.timestamp}
              </Typography>

              {/* 수정/삭제 메뉴 */}
              {selectedMessageId === message.id && message.sender === 'me' && (
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
                        messageId={message.id}
                        onDelete={(messageId) => {
                          onDeleteMessage(messageId);
                          setSelectedMessageId(null);
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>
              )}
            </Paper>
          </Box>
        ))}
      </Box>

      {/* 메시지 입력/수정 영역 */}
      {messages.find(msg => msg.isEditing) ? (
        <ChatEdit
          messageId={messages.find(msg => msg.isEditing)!.id}
          initialText={messages.find(msg => msg.isEditing)!.content}
          onSave={(messageId, newText) => {
            onEditMessage(messageId, newText);
            const updatedMessages = messages.map(msg =>
              msg.id === messageId ? { ...msg, isEditing: false } : msg
            );
          }}
          onCancel={() => {
            const updatedMessages = messages.map(msg =>
              msg.isEditing ? { ...msg, isEditing: false } : msg
            );
          }}
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