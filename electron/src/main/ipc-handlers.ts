import { ipcMain, dialog, BrowserWindow } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { CopilotManager } from './copilot';
import { FileManager } from './file-manager';
import type { Presentation } from '../shared/types';

const copilotManager = new CopilotManager();
const fileManager = new FileManager();

export function setupIpcHandlers(): void {
  // Copilot handlers
  ipcMain.handle('copilot:send', async (event, prompt: string) => {
    try {
      const response = await copilotManager.send(prompt, (chunk: string) => {
        event.sender.send('copilot:stream', chunk);
      });
      return response;
    } catch (error) {
      console.error('Copilot error:', error);
      throw error;
    }
  });

  ipcMain.handle('copilot:cancel', async () => {
    copilotManager.cancel();
  });

  // File handlers
  ipcMain.handle('file:new', async () => {
    return fileManager.createNew();
  });

  ipcMain.handle('file:open', async () => {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) return null;

    const result = await dialog.showOpenDialog(window, {
      filters: [
        { name: 'Nietzsche Presentations', extensions: ['nietzsche'] },
        { name: 'JSON Files', extensions: ['json'] },
      ],
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return fileManager.open(result.filePaths[0]);
  });

  ipcMain.handle('file:save', async (_event, presentation: Presentation) => {
    return fileManager.save(presentation);
  });

  ipcMain.handle('file:save-as', async (_event, presentation: Presentation) => {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) return null;

    const result = await dialog.showSaveDialog(window, {
      filters: [
        { name: 'Nietzsche Presentations', extensions: ['nietzsche'] },
      ],
      defaultPath: `${presentation.title}.nietzsche`,
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await fileManager.saveAs(presentation, result.filePath);
    return result.filePath;
  });

  ipcMain.handle('file:export-pptx', async (_event, presentation: Presentation) => {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) return null;

    const result = await dialog.showSaveDialog(window, {
      filters: [
        { name: 'PowerPoint Presentations', extensions: ['pptx'] },
      ],
      defaultPath: `${presentation.title}.pptx`,
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await fileManager.exportToPptx(presentation, result.filePath);
    return result.filePath;
  });

  // App info
  ipcMain.handle('app:get-version', async () => {
    const { app } = await import('electron');
    return app.getVersion();
  });
}
