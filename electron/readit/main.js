const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const WinState = require('electron-win-state').default; // 保存窗口位置和大小的调整
// 获取网站的截图
require('./controller/getSource');
// alert
require('./controller/alert');
// open window
require('./controller/openWindow');
// get file list
require('./controller/getFilelist');
// build menu
require('./controller/buildMenu');
// tray 兼容mac托盘
const createTray = require('./controller/tray');

const createWindow = ()=> {
  const winState = new WinState({
    defaultWidth: 1000,
    defaultHeight: 800,
    electronStoreOptions: {
      name: 'window-state-main'
    }
  });
  const win = new BrowserWindow({
    ...winState.winOptions,
    webPreferences: {
      preload: path.resolve(__dirname, './preload/index.js')
    },
    show: false,
    // 托盘 兼容window
    icon: nativeImage.createFromPath(path.resolve(__dirname, './icon.png')),
    
  });

  win.loadURL('http://localhost:5173');
  // win.webContents.openDevTools();
  winState.manage(win);
  win.on('ready-to-show', ()=> {
    win.show();
  });

  createTray(app, win);
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