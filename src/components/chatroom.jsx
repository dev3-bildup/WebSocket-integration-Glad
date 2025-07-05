import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './chatmessage';

const ChatRoom = ({ messages, sendMessage, username, isConnected }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && isConnected) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl bg-indigo-200 font-bold mb-4 text-center p-4">Chat Room</h1>
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-black text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              isOwnMessage={msg.username === username}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2 p-4">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={isConnected ? 'Type a message...' : 'Disconnected'}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
          disabled={!isConnected}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 px-10 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!isConnected }
        >
          Send
        </button>
      </form>
      {!isConnected && (
        <p className="text-red-500 text-center mt-2 p-4">Disconnected from server</p>
      )}
    </div>
  );
};

export default ChatRoom;