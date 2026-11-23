import { contextBridge, ipcRenderer } from 'electron';

// Exponer una API mínima y segura al renderer
contextBridge.exposeInMainWorld('api', {
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),
  loadConfig: (): Promise<unknown> => ipcRenderer.invoke('config:load'),
  saveConfig: (params: unknown): Promise<boolean> => ipcRenderer.invoke('config:save', params),
});
