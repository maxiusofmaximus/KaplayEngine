import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as fs from 'fs';
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
    const indexPath = path.join(app.getAppPath(), 'renderer', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setAppMenu();
}

// IPC mínimo de prueba
ipcMain.handle('ping', () => 'pong');

const DENSITY_KEYS = ['tree', 'stone', 'coal', 'iron', 'water'];
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function isValidParams(p: unknown): boolean {
  if (typeof p !== 'object' || p === null) return false;
  const { width, height, seed, density } = p as Record<string, unknown>;
  if (!isNum(width) || !isNum(height) || !isNum(seed)) return false;
  if (typeof density !== 'object' || density === null) return false;
  return DENSITY_KEYS.every((k) => isNum((density as Record<string, unknown>)[k]));
}

function configPath(): string {
  return path.join(app.getPath('userData'), 'config.json');
}

// Nunca lanza: si no hay config o está corrupta, devuelve null.
ipcMain.handle('config:load', () => {
  try {
    return JSON.parse(fs.readFileSync(configPath(), 'utf8'));
  } catch {
    return null;
  }
});

ipcMain.handle('config:save', (_e, params: unknown) => {
  if (!isValidParams(params)) return false;
  try {
    fs.mkdirSync(app.getPath('userData'), { recursive: true });
    fs.writeFileSync(configPath(), JSON.stringify(params, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});