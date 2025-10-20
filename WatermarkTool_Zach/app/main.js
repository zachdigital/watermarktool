const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function createWindow () {
  const win = new BrowserWindow({
    width: 1280, height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false
    }
  });
  win.removeMenu();
  win.loadFile('index.html');
  if (isDev) win.webContents.openDevTools({ mode: 'detach' });
}
app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
ipcMain.handle('pick-file', async (_evt, filters) => {
  const res = await dialog.showOpenDialog({ properties: ['openFile'], filters });
  if (res.canceled || res.filePaths.length === 0) return null; return res.filePaths[0];
});
ipcMain.handle('save-as', async (_evt, defaultPath) => {
  const res = await dialog.showSaveDialog({ defaultPath });
  if (res.canceled || !res.filePath) return null; return res.filePath;
});
ipcMain.handle('video-add-watermark', async (_evt, payload) => {
  const { input, output, logo, text, x, y, fontsize, fontcolor } = payload;
  return new Promise((resolve, reject) => {
    let cmd = ffmpeg(input);
    if (logo) cmd = cmd.input(logo);
    const filter = [];
    if (logo) filter.push(`[0:v][1:v]overlay=${x}:${y}[v1]`);
    if (text) {
      const draw = `drawtext=text='${(text||'').replace(/'/g,"\\'")}':fontcolor=${fontcolor||'white'}:fontsize=${fontsize||36}:x=${(x||'W-w-20').toLowerCase()}:y=${(y||'H-h-20').toLowerCase()}`;
      if (logo) filter.push(`[v1]${draw}[v2]`); else filter.push(`[0:v]${draw}[v2]`);
    }
    const fc = filter.join(';');
    const mapv = (text || logo) ? '[v2]' : '[v1]';
    cmd.videoFilters(fc).outputOptions(['-map', mapv, '-map', '0:a?', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-c:a', 'copy'])
      .on('error', err => reject(String(err))).on('end', () => resolve('ok')).save(output);
  });
});
ipcMain.handle('video-delogo', async (_evt, payload) => {
  const { input, output, x, y, w, h } = payload;
  return new Promise((resolve, reject) => {
    ffmpeg(input).outputOptions(['-vf', `delogo=x=${x}:y=${y}:w=${w}:h=${h}`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-c:a', 'copy'])
      .on('error', err => reject(String(err))).on('end', () => resolve('ok')).save(output);
  });
});