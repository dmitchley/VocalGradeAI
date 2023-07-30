// const { ipcRenderer } = require("electron");

// document.getElementById("start").addEventListener("click", () => {
//   ipcRenderer.send("record-start");
// });

// document.getElementById("stop").addEventListener("click", () => {
//   ipcRenderer.send("record-stop");
// });

const { ipcRenderer } = require("electron");

document.getElementById("start").addEventListener("click", () => {
  ipcRenderer.send("start-recording");
});

document.getElementById("stop").addEventListener("click", () => {
  ipcRenderer.send("stop-recording");
});

ipcRenderer.on("transcription-done", (event, transcription) => {
  // Handle the received transcription, e.g., display it on your app.
  console.log(transcription);
});
