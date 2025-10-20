# WatermarkTool (Electron + FFmpeg)

👉 你只需网页点几下就能拿到 Windows EXE：
1. 在 GitHub 新建仓库，把本 `app/` 目录的所有文件上传。
2. 打开仓库 **Actions**，等待 workflow 完成。
3. 在 **Artifacts** 下载 `WatermarkTool-*.exe`（可 portable/安装版）。

本地开发（可选）：
```
cd app
npm i
npm run start
# 打包：npm run dist（portable） 或 npm run dist:nsis（安装器）
```

- 使用 ffmpeg-static + fluent-ffmpeg（无需用户另装 ffmpeg）。
- 你可把自己的 UI 替换 `index.html` 并通过 `window.wm.*` 接口调用处理。
