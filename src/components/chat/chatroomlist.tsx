import React, { useMemo } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, Paper, Badge } from '@mui/material';
import { ChatRoom } from '@/types/chat';
import { getDateFromTimestamp } from '@/utils/dateUtils';

/**
 * ChatRoomList 컴포넌트 Props 인터페이스
 * @property {ChatRoom[]} chatRooms - 채팅방 목록
 * @property {function} onSelectChat - 채팅방 선택 시 호출될 콜백 함수
 * @property {function} onLeaveRoom - 채팅방 나가기 시 호출될 콜백 함수
 * @property {string} currentUserId - 현재 사용자 ID
 */
interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  onSelectChat: (chatId: string) => void;
  onLeaveRoom: (chatId: string) => void;
  currentUserId: string;
}

interface GroupedChatRooms {
  [key: string]: ChatRoom[];
}

/**
 * 채팅방 목록을 표시하는 컴포넌트
 * 각 채팅방의 이름, 마지막 메시지, 시간을 보여주고 클릭 시 해당 채팅방을 선택합니다.
 * 읽지 않은 메시지가 있는 경우 파란색 배지로 표시합니다.
 */
const ChatRoomList: React.FC<ChatRoomListProps> = ({ chatRooms, onSelectChat, onLeaveRoom, currentUserId }) => {
  // 채팅방을 최신순으로 정렬
  const sortedChatRooms = useMemo(() => {
    return [...chatRooms].sort((a, b) => {
      const dateA = getDateFromTimestamp(a.timestamp);
      const dateB = getDateFromTimestamp(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }, [chatRooms]);

  return (
    <Paper elevation={2} sx={{ height: '100%', overflow: 'auto' }}>
      <Box p={2}>
        <Typography variant="h6" component="div" gutterBottom>
          채팅방 목록
        </Typography>
        <List>
          {/* 전체 안 읽은 메시지 수를 첫 번째 아이템으로 추가 */}
          <ListItemButton
            sx={{
              borderBottom: '1px solid #eee',
              backgroundColor: 'transparent',
              cursor: 'default',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography component="div">전체 안 읽은 메시지</Typography>
                  <Badge
                    badgeContent={sortedChatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0)}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontSize: '0.9rem',
                        minWidth: '20px',
                        height: '20px',
                        padding: '0 6px'
                      },
                    }}
                  />
                </Box>
              }
            />
          </ListItemButton>

          {/* 채팅방 목록 */}
          {sortedChatRooms.map((room) => (
            <ListItemButton
              key={room.id}
              onClick={() => onSelectChat(room.id)}
              sx={{
                borderBottom: '1px solid #eee',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography component="div">{room.name}</Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        component="div"
                        variant="body2"
                        color="text.primary"
                        sx={{ 
                          display: 'block',
                          fontWeight: room.unreadCount > 0 ? 'bold' : 'normal',
                          color: room.lastMessage === '삭제된 메시지입니다.' ? '#9e9e9e' : 'inherit',
                          fontStyle: room.lastMessage === '삭제된 메시지입니다.' ? 'italic' : 'normal'
                        }}
                      >
                        {room.lastMessage}
                      </Typography>
                      <Typography
                        component="div"
                        variant="caption"
                        color="text.secondary"
                      >
                        {room.timestamp}
                      </Typography>
                    </Box>
                    {room.unreadCount > 0 && (
                      <Badge
                        badgeContent={room.unreadCount}
                        color="primary"
                        sx={{
                          ml: 1,
                          '& .MuiBadge-badge': {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            fontSize: '0.9rem',
                            minWidth: '20px',
                            height: '20px',
                            padding: '0 6px'
                          },
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ChatRoomList; 