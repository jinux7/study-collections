import { ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { __dirnameFn } from '../utils.js';

ipcMain.handle('on-del-text-event', (e, str)=> {
  const data = JSON.parse(str);
  const filePath = path.resolve(__dirnameFn(import.meta.url), '../public/files/', data.title + '-' + data.city + '.txt');
  fs.unlinkSync(filePath, data.desc);
});