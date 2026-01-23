import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChatStore } from '../stores/chat-store';
import { usePresentationStore } from '../stores/presentation-store';
import type { ChatMessage, Slide } from '../../shared/types';

export function Chat(): React.ReactElement {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isStreaming,
    streamingContent,
    addMessage,
    setStreaming,
    appendStreamContent,
    finalizeStream,
    setError,
  } = useChatStore();

  const { addSlide } = usePresentationStore();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Set up stream listener
  useEffect(() => {
    const unsubscribe = window.electron.on('copilot:stream', (chunk: unknown) => {
      if (typeof chunk === 'string') {
        appendStreamContent(chunk);
        // Check if the chunk contains slide JSON
        parseAndAddSlides(chunk);
      }
    });

    return unsubscribe;
  }, [appendStreamContent]);

  const parseAndAddSlides = (content: string): void => {
    // Look for JSON slide blocks in the response
    const jsonMatch = content.match(/```json:slides\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const slides = JSON.parse(jsonMatch[1]) as Slide[];
        slides.forEach((slide) => {
          addSlide(slide.layout, slide.title, slide.content);
        });
      } catch {
        // Ignore parse errors during streaming
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setStreaming(true);

    try {
      await window.electron.invoke('copilot:send', userMessage);
      finalizeStream();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      finalizeStream();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <div className="chat-message chat-message-assistant">
            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
              {streamingContent}
            </ReactMarkdown>
            <span className="cursor-blink" />
          </div>
        )}

        {/* Loading indicator */}
        {isStreaming && !streamingContent && (
          <div className="chat-message chat-message-assistant">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your presentation..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}>
      {isUser ? (
        <p className="text-sm">{message.content}</p>
      ) : (
        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
          {message.content}
        </ReactMarkdown>
      )}
    </div>
  );
}
