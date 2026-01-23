import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../../shared/types';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;

  // Actions
  addMessage: (role: 'user' | 'assistant' | 'system', content: string) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreamContent: (content: string) => void;
  finalizeStream: () => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: uuidv4(),
      role: 'assistant',
      content:
        "Hello! I'm Nietzsche, your AI presentation assistant. Describe the presentation you want to create, and I'll help you build it slide by slide.\n\nFor example, try:\n- \"Create a pitch deck for a SaaS product\"\n- \"Make a presentation about machine learning basics\"\n- \"Generate slides for a quarterly business review\"",
      timestamp: new Date().toISOString(),
    },
  ],
  isStreaming: false,
  streamingContent: '',
  error: null,

  addMessage: (role, content) => {
    const message: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setStreaming: (streaming) => {
    set({ isStreaming: streaming, streamingContent: '' });
  },

  appendStreamContent: (content) => {
    set((state) => ({
      streamingContent: state.streamingContent + content,
    }));
  },

  finalizeStream: () => {
    const { streamingContent } = get();
    if (streamingContent) {
      const message: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: streamingContent,
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, message],
        isStreaming: false,
        streamingContent: '',
      }));
    } else {
      set({ isStreaming: false });
    }
  },

  clearMessages: () => {
    set({
      messages: [],
      streamingContent: '',
      isStreaming: false,
      error: null,
    });
  },

  setError: (error) => {
    set({ error, isStreaming: false });
  },
}));
