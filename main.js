const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("start-recording", (event, arg) => {
  const python = spawn("python", ["audio_recorder.py"]);
  python.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
});

ipcMain.on("stop-recording", (event, arg) => {
  const fs = require("fs");
  fs.writeFileSync("stop.txt", "Stop");
});
