// 兼容mac电脑
import { Tray } from 'electron';
import path from 'path';
import { __dirnameFn } from '../utils.js';

const createTray = (app, win)=> {
  const tray = new Tray(path.resolve(__dirnameFn(import.meta.url), '../icon.png'));
  tray.setToolTip('electron-tutorial');
  tray.on('click', e=> {
    if(e.shiftKey) {
      app.quit();
    }
  });
}

export default createTray;