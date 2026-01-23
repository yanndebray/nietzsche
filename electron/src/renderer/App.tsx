import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { Preview } from './components/Preview';
import { Editor } from './components/Editor';
import { usePresentationStore } from './stores/presentation-store';
import { useUIStore } from './stores/ui-store';

export default function App(): React.ReactElement {
  const { presentation, selectedSlideId, loadNew } = usePresentationStore();
  const { showEditor, toggleEditor } = useUIStore();

  useEffect(() => {
    // Initialize with a new presentation
    loadNew();

    // Set up menu event listeners
    const unsubscribers = [
      window.electron.on('menu:new', () => loadNew()),
      window.electron.on('menu:open', async () => {
        const result = await window.electron.invoke('file:open');
        if (result) {
          usePresentationStore.getState().setPresentation(result);
        }
      }),
      window.electron.on('menu:save', async () => {
        const pres = usePresentationStore.getState().presentation;
        if (pres) {
          await window.electron.invoke('file:save', pres);
        }
      }),
      window.electron.on('menu:save-as', async () => {
        const pres = usePresentationStore.getState().presentation;
        if (pres) {
          await window.electron.invoke('file:save-as', pres);
        }
      }),
      window.electron.on('menu:export-pptx', async () => {
        const pres = usePresentationStore.getState().presentation;
        if (pres) {
          await window.electron.invoke('file:export-pptx', pres);
        }
      }),
      window.electron.on('menu:add-slide', () => {
        usePresentationStore.getState().addSlide();
      }),
      window.electron.on('menu:delete-slide', () => {
        const id = usePresentationStore.getState().selectedSlideId;
        if (id) {
          usePresentationStore.getState().removeSlide(id);
        }
      }),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [loadNew]);

  const selectedSlide = presentation?.slides.find((s) => s.id === selectedSlideId);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Title bar drag region for macOS */}
      <div className="h-8 drag-region bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {presentation?.title || 'Nietzsche'}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with slide thumbnails */}
        <Sidebar />

        {/* Main area */}
        <div className="flex-1 flex">
          {/* Chat panel */}
          <div className="w-96 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-800">
            <Chat />
          </div>

          {/* Preview/Editor area */}
          <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900">
            {/* Toggle button */}
            <div className="p-2 flex justify-end border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button
                onClick={toggleEditor}
                className="px-3 py-1.5 text-sm rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {showEditor ? 'Preview' : 'Edit'}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
              {showEditor && selectedSlide ? (
                <Editor slide={selectedSlide} />
              ) : (
                <Preview slide={selectedSlide} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
