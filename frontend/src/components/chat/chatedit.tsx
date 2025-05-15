'use client';

import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Message } from '@/types/chat';

/**
 * ChatEdit 컴포넌트 Props 인터페이스
 * @property {Message} message - 수정할 메시지 객체
 * @property {function} onUpdateMessage - 메시지 수정 콜백 함수
 * @property {function} onCancel - 수정 취소 콜백 함수
 */
interface ChatEditProps {
  message: Message;
  onUpdateMessage: (messageId: string, newContent: string, editedAt: string) => void;
  onCancel: () => void;
}

/**
 * 메시지 수정 컴포넌트
 * 메시지 수정 기능을 제공하는 컴포넌트입니다.
 * 수정된 메시지를 저장하거나 취소할 수 있습니다.
 */
export default function ChatEdit({ message, onUpdateMessage, onCancel }: ChatEditProps) {
  const [editedContent, setEditedContent] = useState(message.content);

  /**
   * 메시지 수정 저장 핸들러
   * 수정된 메시지가 비어있지 않은 경우에만 저장합니다.
   */
  const handleSave = () => {
    if (editedContent.trim()) {
      const now = new Date().toISOString();
      onUpdateMessage(message.id, editedContent, now);
    }
  };

  /**
   * 키 입력 핸들러
   * Enter 키 입력 시 메시지를 저장합니다. (Shift + Enter는 줄바꿈)
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          variant="outlined"
          size="small"
          autoFocus
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!editedContent.trim()}
            sx={{
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
              '&.Mui-disabled': {
                bgcolor: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            저장
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: '#757575',
              borderColor: '#757575',
              '&:hover': {
                bgcolor: '#f5f5f5',
                borderColor: '#616161',
              },
            }}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
