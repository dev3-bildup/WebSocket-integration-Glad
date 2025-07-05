import { useState, useEffect, useCallback, useRef } from 'react';
import ChatRoom from './components/chatroom';
import DOMPurify from 'dompurify';
import './App.css';

const STORAGE_KEY = 'chatMessages';

const App = () => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [username] = useState('Glad:');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const connectWebSocket = useCallback(() => {
    const chat = new WebSocket('wss://echo.websocket.org');

    chat.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setConnectionError(null);
    };

    chat.onmessage = (event) => {
      try {
        const data = event.data.trim();
        if (!data.startsWith('{') && !data.startsWith('[')) {
          console.log('Received non-JSON message:', data);
          return;
        }

        const message = JSON.parse(data);
        if (message.username && message.message && message.timestamp) {
          const sanitizedMessage = {
            ...message,
            message: DOMPurify.sanitize(message.message, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
          };

          // Avoid duplicates
          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.username === sanitizedMessage.username &&
                msg.message === sanitizedMessage.message &&
                msg.timestamp === sanitizedMessage.timestamp
            );
            return exists ? prev : [...prev, sanitizedMessage];
          });
        }
      } catch (error) {
        console.error('Message parse error:', error);
      }
    };

    chat.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setConnectionError('Disconnected. Refresh to reconnect.');
    };

    chat.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionError('WebSocket error occurred.');
    };

    socketRef.current = chat;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [messages]);

  const sendMessage = (messageText) => {
    if (socketRef.current && isConnected && username && messageText.trim()) {
      const sanitized = DOMPurify.sanitize(messageText, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
      const message = {
        username,
        message: sanitized,
        timestamp: new Date().toISOString(),
      };

      try {
        socketRef.current.send(JSON.stringify(message));
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Send error:', error);
        setConnectionError('Send failed.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full h-screen bg-white">
        {connectionError && (
          <p className="text-red-500 text-center mb-4">{connectionError}</p>
        )}
        <ChatRoom
          messages={messages}
          sendMessage={sendMessage}
          username={username}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default App;
