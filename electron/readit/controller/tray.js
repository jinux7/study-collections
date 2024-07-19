// 兼容mac电脑
const { Tray } = require('electron');
const path = require('path');

const createTray = (app, win)=> {
  const tray = new Tray(path.resolve(__dirname, '../icon.png'));
  tray.setToolTip('readit');
  tray.on('click', e=> {
    if(e.shiftKey) {
  console.log('tray');

      app.quit();
    }
  });
}

module.exports = createTray;