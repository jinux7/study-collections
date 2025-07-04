import { ipcMain } from 'electron';
import { dialog } from 'electron';
import { win as mainWindow } from '../main.js';
import { __dirnameFn } from '../utils.js';

ipcMain.handle('on-select-directory-event', (e, str)=> {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      console.log('Selected directory path:', result.filePaths[0]);
      // 可以在这里将路径发送回渲染进程
      mainWindow.webContents.send('on-select-directory-callback-event', result.filePaths[0]);
    }
  }).catch(err => {
    console.error(err);
  });
});