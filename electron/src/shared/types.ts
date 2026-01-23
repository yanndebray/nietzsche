// Presentation types
export interface Presentation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
  theme: Theme;
  metadata: PresentationMetadata;
}

export interface Slide {
  id: string;
  order: number;
  layout: SlideLayout;
  title: string;
  content: string;
  speakerNotes?: string;
  images?: SlideImage[];
  style?: SlideStyle;
}

export type SlideLayout =
  | 'title'
  | 'content'
  | 'two-column'
  | 'image-left'
  | 'image-right'
  | 'quote'
  | 'code'
  | 'comparison';

export interface SlideImage {
  id: string;
  url: string;
  alt: string;
  position: 'left' | 'right' | 'center' | 'background';
}

export interface SlideStyle {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
}

export interface PresentationMetadata {
  author?: string;
  description?: string;
  tags?: string[];
  sourceFiles?: string[];
}

// Chat/Copilot types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

// IPC channel types
export interface IpcChannels {
  // Copilot
  'copilot:send': (prompt: string) => Promise<string>;
  'copilot:stream': (chunk: string) => void;
  'copilot:cancel': () => void;

  // File operations
  'file:new': () => Promise<Presentation>;
  'file:open': () => Promise<Presentation | null>;
  'file:save': (presentation: Presentation) => Promise<boolean>;
  'file:save-as': (presentation: Presentation) => Promise<string | null>;
  'file:export-pptx': (presentation: Presentation) => Promise<string | null>;

  // App
  'app:get-version': () => Promise<string>;
}

// Electron API exposed to renderer
export interface ElectronAPI {
  invoke<K extends keyof IpcChannels>(
    channel: K,
    ...args: Parameters<IpcChannels[K]>
  ): ReturnType<IpcChannels[K]>;
  on(channel: string, callback: (...args: unknown[]) => void): () => void;
  send(channel: string, ...args: unknown[]): void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
