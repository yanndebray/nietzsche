import React from 'react';
import { usePresentationStore } from '../stores/presentation-store';
import type { Slide } from '../../shared/types';

export function Sidebar(): React.ReactElement {
  const { presentation, selectedSlideId, selectSlide, addSlide } = usePresentationStore();

  return (
    <div className="w-52 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Slides
          </span>
          <button
            onClick={() => addSlide()}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Add slide"
          >
            <svg
              className="w-5 h-5 text-slate-500 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {presentation?.slides.map((slide, index) => (
          <SlideThumbnail
            key={slide.id}
            slide={slide}
            index={index}
            isSelected={slide.id === selectedSlideId}
            onClick={() => selectSlide(slide.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function SlideThumbnail({
  slide,
  index,
  isSelected,
  onClick,
}: SlideThumbnailProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-lg overflow-hidden transition-all
        ${
          isSelected
            ? 'ring-2 ring-blue-500 shadow-md'
            : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600'
        }
      `}
    >
      {/* Thumbnail preview */}
      <div className="slide-preview bg-white dark:bg-slate-700 p-2">
        <div className="h-full flex flex-col">
          {/* Mini title */}
          <div
            className={`
              text-xs font-medium truncate
              ${slide.layout === 'title' ? 'text-center mt-auto mb-auto' : ''}
            `}
          >
            {slide.title || 'Untitled'}
          </div>

          {/* Mini content preview */}
          {slide.layout !== 'title' && (
            <div className="mt-1 text-[8px] text-slate-400 line-clamp-2">
              {slide.content?.split('\n').slice(0, 2).join(' ') || ''}
            </div>
          )}
        </div>
      </div>

      {/* Slide number */}
      <div className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-xs text-slate-500 dark:text-slate-300">
        {index + 1}. {getLayoutLabel(slide.layout)}
      </div>
    </button>
  );
}

function getLayoutLabel(layout: string): string {
  const labels: Record<string, string> = {
    title: 'Title',
    content: 'Content',
    'two-column': 'Two Column',
    'image-left': 'Image Left',
    'image-right': 'Image Right',
    quote: 'Quote',
    code: 'Code',
    comparison: 'Comparison',
  };
  return labels[layout] || layout;
}
