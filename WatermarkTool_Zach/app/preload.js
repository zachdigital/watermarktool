const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('wm', {
  pickFile: (filters) => ipcRenderer.invoke('pick-file', filters),
  saveAs: (defaultPath) => ipcRenderer.invoke('save-as', defaultPath),
  addVideoWatermark: (payload) => ipcRenderer.invoke('video-add-watermark', payload),
  delogoVideo: (payload) => ipcRenderer.invoke('video-delogo', payload),
});