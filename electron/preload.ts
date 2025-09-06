import { contextBridge, ipcRenderer } from 'electron';

// Exponer una API mínima y segura al renderer
contextBridge.exposeInMainWorld('api', {
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),
});