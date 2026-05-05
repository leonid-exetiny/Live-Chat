import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../services/api';

const ChatRoom = () => {
  const { roomName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadRoomAndMessages();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRoomAndMessages = async () => {
    try {
      const roomsResponse = await roomAPI.getRooms();
      const room = roomsResponse.data.find((r) => r.name === roomName);

      if (room) {
        setRoomId(room.id);
        const messagesResponse = await roomAPI.getMessages(room.id);
        setMessages(messagesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load room/messages:', error);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('access_token');
    const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) =>
              msg.content === data.message &&
              msg.user.username === data.username &&
              Math.abs(new Date(msg.timestamp) - new Date()) < 1000
          );

          if (isDuplicate) return prev;

          return [
            ...prev,
            {
              user: { username: data.username, id: data.user_id },
              content: data.message,
              timestamp: new Date().toISOString(),
            },
          ];
        });
      } else if (data.type === 'user_join') {
        setOnlineUsers((prev) => new Set([...prev, data.username]));
        showNotification(`${data.username} joined the chat`);
      } else if (data.type === 'user_leave') {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.username);
          return newSet;
        });
        showNotification(`${data.username} left the chat`);
      } else if (data.type === 'typing') {
        handleTypingIndicator(data.username, data.is_typing);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);
  };

  const handleTypingIndicator = (username, isTyping) => {
    if (username === user.username) return;

    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(username);
      } else {
        newSet.delete(username);
      }
      return newSet;
    });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'typing',
          is_typing: e.target.value.length > 0,
        })
      );

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        ws.send(
          JSON.stringify({
            type: 'typing',
            is_typing: false,
          })
        );
      }, 2000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws) return;

    ws.send(
      JSON.stringify({
        message: newMessage,
      })
    );

    ws.send(
      JSON.stringify({
        type: 'typing',
        is_typing: false,
      })
    );

    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Live Chat', { body: message });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          padding: '15px 20px',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Room: {roomName}</h2>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {onlineUsers.size > 0 && `${onlineUsers.size} online`}
          </div>
        </div>
        <button
          onClick={() => navigate('/rooms')}
          style={{ padding: '8px 15px', cursor: 'pointer' }}
        >
          Back to Rooms
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.user.id === user.id ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '60%',
                padding: '10px 15px',
                borderRadius: '10px',
                backgroundColor: msg.user.id === user.id ? '#007bff' : '#fff',
                color: msg.user.id === user.id ? '#fff' : '#000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.8 }}>
                {msg.user.username}
              </div>
              <div>{msg.content}</div>
              <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.size > 0 && (
        <div style={{ padding: '5px 20px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
          {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <form
        onSubmit={sendMessage}
        style={{
          padding: '15px 20px',
          borderTop: '1px solid #ccc',
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 30px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
