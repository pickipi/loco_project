/**
 * 메시지 인터페이스
 * @property {string} id - 메시지 고유 ID
 * @property {string} content - 메시지 내용
 * @property {string} sender - 메시지 발신자 ('me' 또는 'other')
 * @property {string} timestamp - 메시지 전송 시간
 * @property {boolean} isEditing - 메시지 수정 모드 여부
 * @property {boolean} isDeleted - 메시지 삭제 여부
 * @property {string} deletedAt - 메시지 삭제 시간
 * @property {string} editedAt - 메시지 수정 시간
 */
export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isEditing?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  editedAt?: string;
}

/**
 * 채팅방 정보 인터페이스
 * @property {string} id - 채팅방 고유 ID
 * @property {string} name - 채팅방 이름
 * @property {string} lastMessage - 마지막 메시지 내용
 * @property {string} timestamp - 마지막 메시지 시간
 * @property {number} unreadCount - 읽지 않은 메시지 수
 * @property {string[]} participants - 참여자 ID 목록
 * @property {string[]} leftParticipants - 나간 참여자 ID 목록
 */
export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  participants: string[];
  leftParticipants: string[];
}

/**
 * 채팅방 데이터 인터페이스
 * @property {Message[]} messages - 채팅방의 메시지 목록
 */
export interface ChatRoomData extends ChatRoom {
  messages: Message[];
}

/**
 * Chat 컴포넌트 Props 인터페이스
 * @property {ChatRoomData[]} initialChatRooms - 초기 채팅방 데이터
 * @property {string} currentUserId - 현재 사용자 ID
 */
export interface ChatProps {
  initialChatRooms?: ChatRoomData[];
  currentUserId: string;
} 