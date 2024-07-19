const { ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');

ipcMain.handle('on-getfiles-event', async (e, args)=> {
  const files = await fs.readdir(path.resolve(__dirname, '../public/uploads/'));
  return files;
});