import { useCallback } from 'react';
import { usePresentationStore } from '../stores/presentation-store';
import type { Slide, SlideLayout } from '../../shared/types';

interface UseSlidesReturn {
  slides: Slide[];
  selectedSlide: Slide | undefined;
  selectedSlideId: string | null;
  selectSlide: (id: string) => void;
  addSlide: (layout?: SlideLayout, title?: string, content?: string) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  removeSlide: (id: string) => void;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  duplicateSlide: (id: string) => void;
}

export function useSlides(): UseSlidesReturn {
  const {
    presentation,
    selectedSlideId,
    selectSlide,
    addSlide,
    updateSlide,
    removeSlide,
    moveSlide,
  } = usePresentationStore();

  const slides = presentation?.slides || [];
  const selectedSlide = slides.find((s) => s.id === selectedSlideId);

  const duplicateSlide = useCallback(
    (id: string): void => {
      const slide = slides.find((s) => s.id === id);
      if (slide) {
        addSlide(slide.layout, `${slide.title} (Copy)`, slide.content);
      }
    },
    [slides, addSlide]
  );

  return {
    slides,
    selectedSlide,
    selectedSlideId,
    selectSlide,
    addSlide,
    updateSlide,
    removeSlide,
    moveSlide,
    duplicateSlide,
  };
}
