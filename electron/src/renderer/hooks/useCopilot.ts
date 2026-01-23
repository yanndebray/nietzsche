import { useCallback, useEffect, useState } from 'react';
import { useChatStore } from '../stores/chat-store';

interface UseCopilotReturn {
  send: (prompt: string) => Promise<void>;
  cancel: () => void;
  isStreaming: boolean;
  error: string | null;
}

export function useCopilot(): UseCopilotReturn {
  const {
    isStreaming,
    error,
    addMessage,
    setStreaming,
    appendStreamContent,
    finalizeStream,
    setError,
  } = useChatStore();

  // Set up stream listener
  useEffect(() => {
    const unsubscribe = window.electron.on('copilot:stream', (chunk: unknown) => {
      if (typeof chunk === 'string') {
        appendStreamContent(chunk);
      }
    });

    return unsubscribe;
  }, [appendStreamContent]);

  const send = useCallback(
    async (prompt: string): Promise<void> => {
      if (isStreaming) return;

      addMessage('user', prompt);
      setStreaming(true);

      try {
        await window.electron.invoke('copilot:send', prompt);
        finalizeStream();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        finalizeStream();
      }
    },
    [isStreaming, addMessage, setStreaming, finalizeStream, setError]
  );

  const cancel = useCallback((): void => {
    window.electron.invoke('copilot:cancel');
    finalizeStream();
  }, [finalizeStream]);

  return {
    send,
    cancel,
    isStreaming,
    error,
  };
}
