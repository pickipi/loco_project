'use client';

import { Box, Typography } from '@mui/material';
import { Message } from '@/types/chat';
import { formatCurrentTime } from '@/utils/dateUtils';

/**
 * ChatDelete 컴포넌트 Props 인터페이스
 * @property {Message} message - 삭제할 메시지 객체
 * @property {function} onSoftDelete - 메시지 소프트 딜리트 콜백 함수
 */
interface ChatDeleteProps {
  message: Message;
  onSoftDelete: (messageId: string, deletedAt: string) => void;
}

/**
 * 메시지 삭제 컴포넌트
 * 메시지 소프트 딜리트 기능을 제공하는 컴포넌트입니다.
 * 삭제 버튼을 클릭하면 해당 메시지가 소프트 딜리트됩니다.
 */
export default function ChatDelete({ message, onSoftDelete }: ChatDeleteProps) {
  /**
   * 메시지 소프트 딜리트 핸들러
   * 클릭 이벤트의 전파를 막고 메시지를 소프트 딜리트합니다.
   */
  const handleSoftDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSoftDelete(message.id, formatCurrentTime());
  };

  return (
    <Box
      sx={{
        p: 1,
        cursor: 'pointer',
        '&:hover': { bgcolor: '#ffebee' },
        color: '#d32f2f',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}
      onClick={handleSoftDelete}
    >
      <Typography variant="body2">
        삭제
      </Typography>
    </Box>
  );
}