import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '../shared/types';

const electronAPI: ElectronAPI = {
  invoke: (channel, ...args) => {
    const validChannels = [
      'copilot:send',
      'copilot:cancel',
      'file:new',
      'file:open',
      'file:save',
      'file:save-as',
      'file:export-pptx',
      'app:get-version',
    ];

    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }

    throw new Error(`Invalid channel: ${channel}`);
  },

  on: (channel, callback) => {
    const validChannels = [
      'copilot:stream',
      'menu:new',
      'menu:open',
      'menu:save',
      'menu:save-as',
      'menu:export-pptx',
      'menu:add-slide',
      'menu:delete-slide',
      'menu:move-slide-up',
      'menu:move-slide-down',
    ];

    if (validChannels.includes(channel)) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => {
        callback(...args);
      };
      ipcRenderer.on(channel, subscription);

      // Return unsubscribe function
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }

    return () => {};
  },

  send: (channel, ...args) => {
    const validChannels = ['app:ready'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', electronAPI);
