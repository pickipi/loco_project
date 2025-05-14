'use client';

import React, { useState } from 'react';
import { Box, Typography, Modal, Paper } from '@mui/material';

/**
 * ChatDelete 컴포넌트 Props 인터페이스
 * @property {string} messageId - 삭제할 메시지의 고유 ID
 * @property {function} onDelete - 메시지 삭제 시 호출될 콜백 함수
 */
interface ChatDeleteProps {
  messageId: string;
  onDelete: (messageId: string) => void;
}

/**
 * 메시지 삭제 버튼 컴포넌트
 * 메시지 삭제 기능을 담당하는 버튼 컴포넌트입니다.
 */
export default function ChatDelete({ messageId, onDelete }: ChatDeleteProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleOpenConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirming(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(messageId);
    setIsConfirming(false);
  };

  return (
    <>
      <Box
        sx={{
          p: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: '#ffebee' },
          color: '#d32f2f',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
        onClick={handleOpenConfirm}
      >
        <Typography variant="body2">
          삭제
        </Typography>
      </Box>

      <Modal
        open={isConfirming}
        onClose={handleCloseConfirm}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 300,
          }}
        >
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              메시지 삭제
            </Typography>
            <Typography sx={{ mb: 3, textAlign: 'center' }}>
              정말로 이 메시지를 삭제하시겠습니까?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Box
                component="button"
                sx={{
                  px: 3,
                  py: 1,
                  border: 'none',
                  borderRadius: 1,
                  bgcolor: '#d32f2f',
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#b71c1c' },
                }}
                onClick={handleDelete}
              >
                삭제
              </Box>
              <Box
                component="button"
                sx={{
                  px: 3,
                  py: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: 'white',
                  color: 'text.primary',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
                onClick={handleCloseConfirm}
              >
                취소
              </Box>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </>
  );
}