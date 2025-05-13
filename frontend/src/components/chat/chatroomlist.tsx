import React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, Paper } from '@mui/material';

/**
 * 채팅방 정보 인터페이스
 * @property {string} id - 채팅방 고유 ID
 * @property {string} name - 채팅방 이름
 * @property {string} lastMessage - 마지막 메시지 내용
 * @property {string} timestamp - 마지막 메시지 시간
 */
interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

/**
 * ChatRoomList 컴포넌트 Props 인터페이스
 * @property {ChatRoom[]} chatRooms - 채팅방 목록
 * @property {function} onSelectChat - 채팅방 선택 시 호출될 콜백 함수
 */
interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  onSelectChat: (chatId: string) => void;
}

/**
 * 채팅방 목록을 표시하는 컴포넌트
 * 각 채팅방의 이름, 마지막 메시지, 시간을 보여주고 클릭 시 해당 채팅방을 선택합니다.
 */
const ChatRoomList: React.FC<ChatRoomListProps> = ({ chatRooms, onSelectChat }) => {
  return (
    <Paper elevation={2} sx={{ height: '100%', overflow: 'auto' }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          채팅방 목록
        </Typography>
        <List>
          {chatRooms.map((room) => (
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
                primary={room.name}
                secondary={
                  <>
                    {/* 마지막 메시지 내용 */}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block' }}
                    >
                      {room.lastMessage}
                    </Typography>
                    {/* 마지막 메시지 시간 */}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {room.timestamp}
                    </Typography>
                  </>
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