'use client';

import { Box, Container, Paper, Typography } from '@mui/material';
import Chat from '@/components/chat/chat';

/**
 * 테스트용 초기 채팅방 데이터
 */
const initialChatRooms = [
  {
    id: '1',
    name: '일반 채팅방',
    lastMessage: '안녕하세요!',
    timestamp: '10:30',
    messages: [
      {
        id: '1',
        content: '안녕하세요!',
        sender: 'other',
        timestamp: '10:30',
      },
      {
        id: '2',
        content: '환영합니다!',
        sender: 'me',
        timestamp: '10:31',
      },
      {
        id: '3',
        content: '오늘 날씨가 좋네요.',
        sender: 'other',
        timestamp: '10:32',
      },
    ],
  },
  {
    id: '2',
    name: '프로젝트 채팅방',
    lastMessage: '회의 시간이 변경되었습니다.',
    timestamp: '09:15',
    messages: [
      {
        id: '1',
        content: '회의 시간이 변경되었습니다.',
        sender: 'other',
        timestamp: '09:15',
      },
      {
        id: '2',
        content: '네, 알겠습니다.',
        sender: 'me',
        timestamp: '09:16',
      },
    ],
  },
  {
    id: '3',
    name: '기술 토론방',
    lastMessage: '새로운 기술 스택을 검토해보면 좋을 것 같아요.',
    timestamp: '11:45',
    messages: [
      {
        id: '1',
        content: '새로운 기술 스택을 검토해보면 좋을 것 같아요.',
        sender: 'other',
        timestamp: '11:45',
      },
      {
        id: '2',
        content: '어떤 기술을 고려하고 계신가요?',
        sender: 'me',
        timestamp: '11:46',
      },
      {
        id: '3',
        content: 'Next.js와 TypeScript를 메인으로 사용하면 좋을 것 같습니다.',
        sender: 'other',
        timestamp: '11:47',
      },
    ],
  },
];

/**
 * 채팅 테스트 페이지
 * 채팅 기능을 테스트할 수 있는 페이지입니다.
 * 초기 데이터를 포함한 채팅방 목록과 메시지를 표시합니다.
 */
export default function ChatTest() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          채팅 테스트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          채팅방을 선택하고 메시지를 주고받으며 수정/삭제 기능을 테스트해보세요.
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
        <Chat initialChatRooms={initialChatRooms} />
      </Paper>
    </Container>
  );
} 