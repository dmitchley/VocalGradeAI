const { ipcRenderer } = require("electron");

document.getElementById("start").addEventListener("click", () => {
  ipcRenderer.send("record-start");
});

document.getElementById("stop").addEventListener("click", () => {
  ipcRenderer.send("record-stop");
});
