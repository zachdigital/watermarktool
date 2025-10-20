window.renderGlue = {
  pickVideo: async () => await window.wm.pickFile([{ name: 'Videos', extensions: ['mp4','mov','avi','mkv'] }]),
  pickImage: async () => await window.wm.pickFile([{ name: 'Images', extensions: ['png','jpg','jpeg','webp','bmp'] }]),
  saveAs: async (defaultPath) => await window.wm.saveAs(defaultPath),
  addVideoWatermark: async (cfg) => await window.wm.addVideoWatermark(cfg),
  delogoVideo: async (cfg) => await window.wm.delogoVideo(cfg),
};