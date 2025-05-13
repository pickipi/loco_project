'use client';

import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

/**
 * ChatEdit 컴포넌트 Props 인터페이스
 * @property {string} messageId - 수정할 메시지의 고유 ID
 * @property {string} initialText - 수정할 메시지의 초기 텍스트
 * @property {function} onSave - 메시지 저장 시 호출될 콜백 함수
 * @property {function} onCancel - 수정 취소 시 호출될 콜백 함수
 */
interface ChatEditProps {
  messageId: string;
  initialText: string;
  onSave: (messageId: string, newText: string) => void;
  onCancel: () => void;
}

/**
 * 메시지 수정 컴포넌트
 * 메시지 내용을 수정할 수 있는 인라인 편집 컴포넌트입니다.
 * 텍스트 입력창과 저장/취소 버튼을 제공합니다.
 */
export default function ChatEdit({ messageId, initialText, onSave, onCancel }: ChatEditProps) {
  // 수정 중인 텍스트를 관리하는 상태
  const [editingText, setEditingText] = useState(initialText);

  /**
   * 메시지 저장 핸들러
   * 입력된 텍스트가 비어있지 않은 경우에만 저장을 수행합니다.
   */
  const handleSave = () => {
    if (editingText.trim()) {
      onSave(messageId, editingText);
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
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="수정할 내용을 입력하세요..."
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!editingText.trim()}
        >
          수정
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          취소
        </Button>
      </Box>
    </Box>
  );
}
