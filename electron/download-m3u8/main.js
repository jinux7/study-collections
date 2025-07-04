import { app, BrowserWindow, nativeImage } from 'electron';
import WinState from 'electron-win-state'; // 保存窗口位置和大小的调整
import path from 'path';
import { __dirnameFn } from './utils.js';

import './controller/selectDir.js';
import './controller/download.js';
import { injectMainWindow } from './controller/buildMenu.js';
// tray 兼容mac托盘
import createTray from './controller/tray.js';

export let win = null;
const createWindow = ()=> {
    const winState = new WinState.default({
      defaultWidth: 1000,
      defaultHeight: 600,
      electronStoreOptions: {
        name: 'window-state-main' // 开启多个窗口的时候分别记录
      }
    });
    win = new BrowserWindow({
      ...winState.winOptions,
      webPreferences: {
        preload: path.resolve(__dirnameFn(import.meta.url), './preload/index.js')
      },
      show: false,
      icon: nativeImage.createFromPath(path.resolve(__dirnameFn(import.meta.url), './icon.png')),
      // frame: false, // 这将会移除整个窗口框架，包括最小化、最大化和关闭按钮
    });
    // 注入到buildMenu中
    injectMainWindow(win);
    // win.loadURL('http://localhost:5173');
    win.loadFile(path.resolve(__dirnameFn(import.meta.url), './dist/index.html'));
    // win.webContents.openDevTools(); // 打开调试工具面板
    winState.manage(win);
    win.on('ready-to-show', ()=> {
      win.show();
      // 设置全屏
      // win.maximize();
      // 退出全屏
      // win.unmaximize();
    });
  }
  
  app.whenReady().then(()=> {
    createWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    });
  });
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
