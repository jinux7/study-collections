const { contextBridge, ipcRenderer } = require('electron')
// 渲染进程触发主进程
const saveText = async data=> {
  let result = await ipcRenderer.invoke('on-save-text-event', data);
  return result;
}
// 渲染进程触发主进程
const delText = async data=> {
  let result = await ipcRenderer.invoke('on-del-text-event', data);
  return result;
}
// 渲染进程触发主进程
const getText = async data=> {
  let result = await ipcRenderer.invoke('on-get-text-event', data);
  return result;
}
// 主进程触发渲染进程
const showAddDialog = cb=> ipcRenderer.on('on-show-add-dialog-event', (e, value)=> {
  cb(value);
});

contextBridge.exposeInMainWorld('rendererApi', {
  saveText,
  delText,
  getText,
  showAddDialog
});