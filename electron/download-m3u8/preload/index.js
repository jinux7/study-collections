const { contextBridge, ipcRenderer } = require('electron')
// 渲染进程触发主进程的选择目录函数
const selectDirectory = async data=> {
  let result = await ipcRenderer.invoke('on-select-directory-event', data);
  return result;
}
// 主进程触发渲染进程
const selectDirectoryCallback = cb=> ipcRenderer.on('on-select-directory-callback-event', (e, value)=> {
  cb(value);
});

// 渲染进程触发主进程的下载函数
const download = async data=> {
  let result = await ipcRenderer.invoke('on-download-event', data);
  return result;
}
// 主进程触发渲染进程
const downloadCallback = cb=> ipcRenderer.on('on-download-callback-event', (e, value)=> {
  cb(value);
});

contextBridge.exposeInMainWorld('rendererApi', {
  selectDirectory,
  selectDirectoryCallback,
  download,
  downloadCallback
});