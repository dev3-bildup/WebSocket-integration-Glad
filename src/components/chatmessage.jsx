import React from 'react';

const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} text-start mb-2`}>
      <div className="flex flex-col">
        <div
          className={`max-w-xs px-4 py-4 rounded-lg text-left ${
            isOwnMessage
              ? 'bg-blue-500 !text-black'
              : 'bg-indigo-900 !text-white'
          }`}
        >
          <div className="flex flex-row items-center space-x-2">
            <p className={`text-sm font-bold ${isOwnMessage ? '!text-black' : '!text-white'}`}>
              {message.username}
            </p>
            <p className={`${isOwnMessage ? '!text-black' : '!text-white'} flex flex-row`}>
              {message.message}
            </p>
          </div>
        </div>
        <div className="flex flex-row mt-1">
          <p className={`text-xs opacity-75 ${isOwnMessage ? '!text-black' : '!text-white'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
