'use client';

import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

interface ChatMessage {
  roomId: string;
  sender: string;
  message: string;
  timestamp: string;
  userType: 'HOST' | 'GUEST';
}

interface User {
  id: string;
  nickname: string;
  userType: 'HOST' | 'GUEST';
  lastActive: string;
}

const HostChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [hostInfo, setHostInfo] = useState<{id: string; nickname: string} | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = searchParams.get('boardId');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // 임시 테스트용 호스트 정보 설정
    setHostInfo({
      id: 'test-host',
      nickname: '테스트 호스트'
    });

    // 임시 테스트용 게스트 목록
    setUsers([
      { id: 'guest1', nickname: '게스트1', userType: 'GUEST', lastActive: new Date().toISOString() },
      { id: 'guest2', nickname: '게스트2', userType: 'GUEST', lastActive: new Date().toISOString() },
      { id: 'guest3', nickname: '게스트3', userType: 'GUEST', lastActive: new Date().toISOString() },
    ]);

    if (!token) {
      console.log('테스트 모드: 토큰 없이 접속');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      
      if (payload.userType === 'HOST') {
        setHostInfo({
          id: payload.sub || '',
          nickname: payload.nickname || '호스트'
        });
      }
    } catch (error) {
      console.error('Token parsing error:', error);
      console.log('테스트 모드로 계속 진행');
    }
  }, [router]);

  useEffect(() => {
    if (!boardId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'test-token'}`
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe(`/topic/chat/board/${boardId}`, (message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, chatMessage]);
        
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [boardId]);

  const sendMessage = () => {
    if (!stompClientRef.current?.active || message.trim() === '' || !boardId) return;

    const chatMessage: ChatMessage = {
      roomId: boardId,
      sender: hostInfo?.nickname || '테스트 호스트',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      userType: 'HOST'
    };

    stompClientRef.current.publish({
      destination: `/app/chat/board/${boardId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'test-token'}`
      },
      body: JSON.stringify(chatMessage)
    });
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!boardId) {
    return <div className="p-4">게시글 ID가 필요합니다.</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">호스트 채팅방</h1>
          <p className="text-sm text-gray-500">
            {isConnected ? '연결됨' : '연결 중...'}
          </p>
          {hostInfo && (
            <p className="text-sm text-blue-600 mt-1">
              호스트 ID: {hostInfo.id} ({hostInfo.nickname})
            </p>
          )}
        </div>

        <div className="p-4 border-b max-h-40 overflow-y-auto bg-gray-50">
          <h2 className="text-sm font-semibold mb-2">접속중인 게스트 목록</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium">{user.nickname}</p>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>
                <span className="text-xs text-green-500">접속중</span>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          ref={chatContainerRef}
          className="p-4 h-[400px] overflow-y-auto"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 ${msg.userType === 'HOST' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-[70%] p-3 rounded-lg ${
                  msg.userType === 'HOST'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p className="break-words">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || message.trim() === ''}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostChatPage; 