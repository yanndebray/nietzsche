import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Slide } from '../../shared/types';
import { usePresentationStore } from '../stores/presentation-store';

interface PreviewProps {
  slide: Slide | undefined;
}

export function Preview({ slide }: PreviewProps): React.ReactElement {
  const { presentation } = usePresentationStore();

  if (!slide) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <p className="text-lg">No slide selected</p>
          <p className="text-sm mt-2">Select a slide from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Slide preview card */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="slide-preview w-full max-w-4xl bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden"
          style={{
            backgroundColor: presentation?.theme.backgroundColor,
            color: presentation?.theme.textColor,
          }}
        >
          <SlideContent slide={slide} theme={presentation?.theme} />
        </div>
      </div>

      {/* Speaker notes */}
      {slide.speakerNotes && (
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Speaker Notes
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">{slide.speakerNotes}</p>
        </div>
      )}
    </div>
  );
}

interface SlideContentProps {
  slide: Slide;
  theme?: { primaryColor: string; textColor: string } | null;
}

function SlideContent({ slide, theme }: SlideContentProps): React.ReactElement {
  switch (slide.layout) {
    case 'title':
      return <TitleSlide slide={slide} theme={theme} />;
    case 'content':
      return <ContentSlide slide={slide} theme={theme} />;
    case 'two-column':
      return <TwoColumnSlide slide={slide} theme={theme} />;
    case 'quote':
      return <QuoteSlide slide={slide} theme={theme} />;
    case 'code':
      return <CodeSlide slide={slide} />;
    default:
      return <ContentSlide slide={slide} theme={theme} />;
  }
}

function TitleSlide({
  slide,
  theme,
}: {
  slide: Slide;
  theme?: { primaryColor: string } | null;
}): React.ReactElement {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
      <h1
        className="text-5xl font-bold mb-6"
        style={{ color: theme?.primaryColor }}
      >
        {slide.title}
      </h1>
      {slide.content && (
        <p className="text-2xl text-slate-500 dark:text-slate-400">{slide.content}</p>
      )}
    </div>
  );
}

function ContentSlide({
  slide,
  theme,
}: {
  slide: Slide;
  theme?: { primaryColor: string } | null;
}): React.ReactElement {
  return (
    <div className="h-full flex flex-col p-12">
      <h2
        className="text-3xl font-bold mb-8"
        style={{ color: theme?.primaryColor }}
      >
        {slide.title}
      </h2>
      <div className="flex-1 prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{slide.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function TwoColumnSlide({
  slide,
  theme,
}: {
  slide: Slide;
  theme?: { primaryColor: string } | null;
}): React.ReactElement {
  const columns = slide.content.split('---').map((col) => col.trim());
  const leftContent = columns[0] || '';
  const rightContent = columns[1] || '';

  return (
    <div className="h-full flex flex-col p-12">
      <h2
        className="text-3xl font-bold mb-8"
        style={{ color: theme?.primaryColor }}
      >
        {slide.title}
      </h2>
      <div className="flex-1 grid grid-cols-2 gap-8">
        <div className="prose dark:prose-invert">
          <ReactMarkdown>{leftContent}</ReactMarkdown>
        </div>
        <div className="prose dark:prose-invert">
          <ReactMarkdown>{rightContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function QuoteSlide({
  slide,
  theme,
}: {
  slide: Slide;
  theme?: { primaryColor: string } | null;
}): React.ReactElement {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
      <blockquote
        className="text-3xl italic mb-6"
        style={{ color: theme?.primaryColor }}
      >
        "{slide.content}"
      </blockquote>
      <cite className="text-xl text-slate-500 dark:text-slate-400">— {slide.title}</cite>
    </div>
  );
}

function CodeSlide({ slide }: { slide: Slide }): React.ReactElement {
  return (
    <div className="h-full flex flex-col p-12">
      <h2 className="text-3xl font-bold mb-8">{slide.title}</h2>
      <pre className="flex-1 bg-slate-900 text-slate-100 rounded-lg p-6 overflow-auto font-mono text-sm">
        <code>{slide.content}</code>
      </pre>
    </div>
  );
}
