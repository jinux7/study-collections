import { ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { __dirnameFn } from '../utils.js';
import { title } from 'process';

ipcMain.handle('on-get-text-event', (e, args)=> {
  let files = fs.readdirSync(path.resolve(__dirnameFn(import.meta.url), '../public/files/'));
  files = files.map(item=> {
    const desc = fs.readFileSync(path.resolve(__dirnameFn(import.meta.url), '../public/files/'+item), 'utf-8');
    const arr = item.split('.')[0].split('-');
  return {
      title: arr[0],
      city: arr[1],
      desc
    }
  });
  return files;
});