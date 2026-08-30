const { app, BrowserWindow, session, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff',
  });

  // Разрешаем микрофон
  mainWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'microphone' || permission === 'media') {
        callback(true);
      } else {
        callback(false);
      }
    }
  );

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// --- IPC: открытие диалога выбора папки (для доступа к файлам) ---
ipcMain.handle('open-file-dialog', async () => {
  if (!mainWindow) return { canceled: true };
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Выберите папку для доступа к файлам',
  });
  return result;
});

// --- IPC: проверка обновлений (заглушка) ---
ipcMain.handle('check-for-updates', async () => {
  return { updateAvailable: false };
});