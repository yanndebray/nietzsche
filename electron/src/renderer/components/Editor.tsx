import React, { useState, useEffect } from 'react';
import type { Slide, SlideLayout } from '../../shared/types';
import { usePresentationStore } from '../stores/presentation-store';
import { LAYOUT_DESCRIPTIONS } from '../../shared/slide-schema';

interface EditorProps {
  slide: Slide;
}

export function Editor({ slide }: EditorProps): React.ReactElement {
  const { updateSlide, removeSlide } = usePresentationStore();

  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [layout, setLayout] = useState(slide.layout);
  const [speakerNotes, setSpeakerNotes] = useState(slide.speakerNotes || '');

  // Sync with slide changes
  useEffect(() => {
    setTitle(slide.title);
    setContent(slide.content);
    setLayout(slide.layout);
    setSpeakerNotes(slide.speakerNotes || '');
  }, [slide.id, slide.title, slide.content, slide.layout, slide.speakerNotes]);

  const handleSave = (): void => {
    updateSlide(slide.id, {
      title,
      content,
      layout,
      speakerNotes: speakerNotes || undefined,
    });
  };

  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      removeSlide(slide.id);
    }
  };

  const layouts: SlideLayout[] = [
    'title',
    'content',
    'two-column',
    'image-left',
    'image-right',
    'quote',
    'code',
    'comparison',
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Edit Slide</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Layout selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Layout</label>
          <div className="grid grid-cols-4 gap-2">
            {layouts.map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`
                  p-2 text-xs rounded border transition-colors
                  ${
                    layout === l
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }
                `}
                title={LAYOUT_DESCRIPTIONS[l]}
              >
                {formatLayoutName(l)}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Slide title"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content
            <span className="text-slate-400 ml-2 font-normal">(Markdown supported)</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getContentPlaceholder(layout)}
            rows={10}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          />
          {layout === 'two-column' && (
            <p className="mt-1 text-xs text-slate-400">
              Use --- to separate left and right columns
            </p>
          )}
        </div>

        {/* Speaker Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Speaker Notes
            <span className="text-slate-400 ml-2 font-normal">(Optional)</span>
          </label>
          <textarea
            id="notes"
            value={speakerNotes}
            onChange={(e) => setSpeakerNotes(e.target.value)}
            placeholder="Add notes for the presenter..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function formatLayoutName(layout: string): string {
  return layout
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getContentPlaceholder(layout: SlideLayout): string {
  const placeholders: Record<SlideLayout, string> = {
    title: 'Subtitle or tagline',
    content: '- Point one\n- Point two\n- Point three',
    'two-column': 'Left column content\n\n---\n\nRight column content',
    'image-left': 'Description text for the right side',
    'image-right': 'Description text for the left side',
    quote: 'The quote text goes here',
    code: 'function example() {\n  return "Hello, World!";\n}',
    comparison: 'Before\n\n---\n\nAfter',
  };
  return placeholders[layout] || 'Enter content here...';
}
