const { ipcMain, BrowserWindow } = require('electron');
const WinState = require('electron-win-state').default; // 保存窗口位置和大小的调整
const path = require('path');
const saveas = require('../controller/saveas');

let win = null;
const cssText = `width: 100px;height: 30px;border-radius: 5px;line-height: 30px;text-align: center;background-color: cornflowerblue;position: fixed;bottom: 50px;right: 20px;color: #ffffff;z-index: 1000;cursor: default;`;
const js = `
  const div = document.createElement('div');
  div.id = 'readit-button';
  div.innerHTML = '关闭窗口';
  div.style.cssText = '${cssText}';
  div.addEventListener('click', ()=> {
    myApi.close();
  });
  document.body.appendChild(div);
`;
ipcMain.handle('on-open-event', (e, url)=> {
  const winState = new WinState({
    defaultWidth: 1000,
    defaultHeight: 800,
    electronStoreOptions: {
      name: 'window-state-open'
    }
  });

  win  = new BrowserWindow({
    ...winState.winOptions,
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/open.js')
    },
  });

  win.on('ready-to-show', ()=> {
    win.show();
  });
  // win.webContents.openDevTools();
  win.loadURL(url);
  winState.manage(win);
  win.webContents.executeJavaScript(js);
  win.webContents.on('context-menu', (e, args)=> {
    saveas(args.srcURL);
  });
});

ipcMain.handle('on-close-event', (e)=> {
  win.close();
});
