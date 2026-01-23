import { v4 as uuidv4 } from 'uuid';
import type { Presentation, Slide, SlideLayout, Theme } from './types';

export const DEFAULT_THEME: Theme = {
  name: 'Default',
  primaryColor: '#0ea5e9',
  secondaryColor: '#64748b',
  backgroundColor: '#ffffff',
  textColor: '#1e293b',
  fontFamily: 'Inter, system-ui, sans-serif',
  headingFont: 'Inter, system-ui, sans-serif',
};

export const DARK_THEME: Theme = {
  name: 'Dark',
  primaryColor: '#38bdf8',
  secondaryColor: '#94a3b8',
  backgroundColor: '#0f172a',
  textColor: '#f1f5f9',
  fontFamily: 'Inter, system-ui, sans-serif',
  headingFont: 'Inter, system-ui, sans-serif',
};

export function createPresentation(title: string = 'Untitled Presentation'): Presentation {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title,
    createdAt: now,
    updatedAt: now,
    slides: [],
    theme: DEFAULT_THEME,
    metadata: {},
  };
}

export function createSlide(
  layout: SlideLayout = 'content',
  title: string = '',
  content: string = ''
): Slide {
  return {
    id: uuidv4(),
    order: 0,
    layout,
    title,
    content,
  };
}

export function addSlideToPresentation(
  presentation: Presentation,
  slide: Slide
): Presentation {
  const newSlide = {
    ...slide,
    order: presentation.slides.length,
  };
  return {
    ...presentation,
    slides: [...presentation.slides, newSlide],
    updatedAt: new Date().toISOString(),
  };
}

export function updateSlideInPresentation(
  presentation: Presentation,
  slideId: string,
  updates: Partial<Slide>
): Presentation {
  return {
    ...presentation,
    slides: presentation.slides.map((slide) =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function removeSlideFromPresentation(
  presentation: Presentation,
  slideId: string
): Presentation {
  const filteredSlides = presentation.slides
    .filter((slide) => slide.id !== slideId)
    .map((slide, index) => ({ ...slide, order: index }));

  return {
    ...presentation,
    slides: filteredSlides,
    updatedAt: new Date().toISOString(),
  };
}

export function reorderSlides(
  presentation: Presentation,
  fromIndex: number,
  toIndex: number
): Presentation {
  const slides = [...presentation.slides];
  const [removed] = slides.splice(fromIndex, 1);
  slides.splice(toIndex, 0, removed);

  return {
    ...presentation,
    slides: slides.map((slide, index) => ({ ...slide, order: index })),
    updatedAt: new Date().toISOString(),
  };
}

export const LAYOUT_DESCRIPTIONS: Record<SlideLayout, string> = {
  title: 'Title slide with main heading and subtitle',
  content: 'Standard slide with title and bullet points',
  'two-column': 'Two columns of content side by side',
  'image-left': 'Image on left, content on right',
  'image-right': 'Content on left, image on right',
  quote: 'Large centered quote with attribution',
  code: 'Code snippet with syntax highlighting',
  comparison: 'Two items compared side by side',
};
