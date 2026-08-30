const { contextBridge, ipcRenderer } = require('electron');

// Безопасный мост между основным процессом и рендером
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  // Проверка обновлений
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),

  // Подписка на статус обновлений
  onUpdateStatus: (callback) => {
    ipcRenderer.on('update-status', (_, status) => callback(status));
  },

  // Открытие диалога выбора папки (для доступа к файлам)
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
});