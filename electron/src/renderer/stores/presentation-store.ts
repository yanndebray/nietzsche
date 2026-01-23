import { create } from 'zustand';
import type { Presentation, Slide, SlideLayout } from '../../shared/types';
import {
  createPresentation,
  createSlide,
  addSlideToPresentation,
  updateSlideInPresentation,
  removeSlideFromPresentation,
  reorderSlides,
} from '../../shared/slide-schema';

interface PresentationState {
  presentation: Presentation | null;
  selectedSlideId: string | null;
  isDirty: boolean;

  // Actions
  setPresentation: (presentation: Presentation) => void;
  loadNew: () => void;
  selectSlide: (slideId: string) => void;
  addSlide: (layout?: SlideLayout, title?: string, content?: string) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  removeSlide: (slideId: string) => void;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  setTitle: (title: string) => void;
  markClean: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  presentation: null,
  selectedSlideId: null,
  isDirty: false,

  setPresentation: (presentation) => {
    set({
      presentation,
      selectedSlideId: presentation.slides[0]?.id || null,
      isDirty: false,
    });
  },

  loadNew: async () => {
    const presentation = await window.electron.invoke('file:new');
    set({
      presentation,
      selectedSlideId: presentation.slides[0]?.id || null,
      isDirty: false,
    });
  },

  selectSlide: (slideId) => {
    set({ selectedSlideId: slideId });
  },

  addSlide: (layout = 'content', title = 'New Slide', content = '') => {
    const { presentation } = get();
    if (!presentation) return;

    const newSlide = createSlide(layout, title, content);
    const updated = addSlideToPresentation(presentation, newSlide);

    set({
      presentation: updated,
      selectedSlideId: newSlide.id,
      isDirty: true,
    });
  },

  updateSlide: (slideId, updates) => {
    const { presentation } = get();
    if (!presentation) return;

    const updated = updateSlideInPresentation(presentation, slideId, updates);
    set({
      presentation: updated,
      isDirty: true,
    });
  },

  removeSlide: (slideId) => {
    const { presentation, selectedSlideId } = get();
    if (!presentation || presentation.slides.length <= 1) return;

    const updated = removeSlideFromPresentation(presentation, slideId);

    // Update selection if needed
    let newSelectedId = selectedSlideId;
    if (selectedSlideId === slideId) {
      const removedIndex = presentation.slides.findIndex((s) => s.id === slideId);
      newSelectedId =
        updated.slides[Math.min(removedIndex, updated.slides.length - 1)]?.id || null;
    }

    set({
      presentation: updated,
      selectedSlideId: newSelectedId,
      isDirty: true,
    });
  },

  moveSlide: (fromIndex, toIndex) => {
    const { presentation } = get();
    if (!presentation) return;

    const updated = reorderSlides(presentation, fromIndex, toIndex);
    set({
      presentation: updated,
      isDirty: true,
    });
  },

  setTitle: (title) => {
    const { presentation } = get();
    if (!presentation) return;

    set({
      presentation: {
        ...presentation,
        title,
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    });
  },

  markClean: () => {
    set({ isDirty: false });
  },
}));
