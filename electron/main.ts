import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function setAppMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload renderer',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reload();
            }
          },
        },
        { type: 'separator' },
        { role: 'toggleDevTools' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Kaplay Engine Editor',
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    // Desarrollo: Vite con HMR
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Producción: cargar el build de Vite
    const indexPath = path.join(process.cwd(), 'renderer', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setAppMenu();
}

// IPC mínimo de prueba
ipcMain.handle('ping', () => 'pong');

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});