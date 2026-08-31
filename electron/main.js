const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
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

    // ⭐ Проверка обновлений через 3 секунды после запуска (только в продакшене)
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000);
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
});

// --- Обработчики автообновлений ---
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Обновление доступно',
    message: 'Доступна новая версия Gehenna. Хотите скачать её сейчас?',
    buttons: ['Да', 'Нет'],
    cancelId: 1,
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.downloadUpdate();
      if (mainWindow) {
        mainWindow.webContents.send('update-status', 'Загрузка обновления...');
      }
    }
  });
});

autoUpdater.on('download-progress', (progress) => {
  const percent = Math.floor(progress.percent);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', `Загрузка: ${percent}%`);
  }
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Готово!',
    message: 'Обновление загружено. Перезапустить приложение для установки?',
    buttons: ['Перезапустить', 'Позже'],
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    } else if (mainWindow) {
      mainWindow.webContents.send('update-status', 'Обновление будет установлено при следующем запуске.');
    }
  });
});

autoUpdater.on('error', (err) => {
  console.error('Ошибка обновления:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'Ошибка при проверке обновлений');
  }
});

// Обработчик для ручной проверки обновлений (из настроек)
ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return result;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
});

// --- Обработчик диалога выбора папки (для доступа к файлам) ---
ipcMain.handle('open-file-dialog', async () => {
  if (!mainWindow) return { canceled: true };
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Выберите папку для доступа к файлам',
  });
  return result;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});