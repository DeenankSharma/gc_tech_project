import React from "react";
import { User, Bot, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { ChatBubbleProps } from "@/types/types";



export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  timestamp 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full py-8 ${isUser ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-800/30'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-8 flex">
        <div className={`shrink-0 mr-4 ${isUser ? 'bg-gray-300 dark:bg-gray-600' : 'bg-green-500'} rounded-full h-8 w-8 flex items-center justify-center`}>
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-white" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <p className="font-medium text-sm">
              {isUser ? 'You' : 'Assistant'}
            </p>
            {timestamp && (
              <p className="ml-2 text-xs text-gray-500">{timestamp}</p>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {message}
          </div>
        </div>

        {!isUser && (
          <div className="ml-2">
            <button 
              onClick={handleCopy} 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded transition-colors"
              aria-label="Copy message"
            >
              {copied ? (
                <CheckCheck size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;