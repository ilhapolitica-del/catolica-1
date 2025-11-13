import React from 'react';
import { Message } from '../types';
import { SourceList } from './SourceList';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Basic helper to render text with line breaks
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-4 shadow-sm
          ${isUser 
            ? 'bg-stone-800 text-white rounded-tr-none' 
            : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
          }
        `}
      >
        {/* Message Content */}
        <div className={`text-base leading-relaxed ${isUser ? 'text-stone-100' : 'text-stone-800'}`}>
          {message.isError ? (
            <span className="text-red-500">{message.text}</span>
          ) : (
            formatText(message.text)
          )}
        </div>

        {/* Sources (Only for model) */}
        {!isUser && !message.isError && (
          <SourceList metadata={message.groundingMetadata} />
        )}
      </div>
    </div>
  );
};