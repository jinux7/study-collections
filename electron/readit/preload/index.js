const { contextBridge, ipcRenderer } = require('electron')

const sendUrl = async url=> {
  let result = await ipcRenderer.invoke('on-url-event', url);
  return result;
}

const alert = msg=> {
  ipcRenderer.invoke('on-alert-event', msg);
}

const open = url=> {
  ipcRenderer.invoke('on-open-event', url);
}

const getFilelist= async ()=> {
  const filelist = await ipcRenderer.invoke('on-getfiles-event');
  return filelist;
}

// 给主进程注册的on-opendialog-event事件发消息
const openDialog = ()=> {
  ipcRenderer.send('on-opendialog-event');
}

// renderer进程注册on-renderer-event事件
const onRendererEvent = (cb)=> {
  ipcRenderer.on('on-renderer-event', (e, msg)=> {
    cb();
  });
}

contextBridge.exposeInMainWorld('myApi', {
  sendUrl,
  alert,
  open,
  getFilelist,
  openDialog,
  onRendererEvent
})