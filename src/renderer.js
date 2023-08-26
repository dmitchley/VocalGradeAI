import "./index.css";

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

import { ipcRenderer } from "electron";
import { writeFile } from "fs";

let mediaRecorder;
let recordedChunks = [];

// Buttons
const videoElement = document.querySelector("video");

const startBtn = document.getElementById("startBtn");
startBtn.onclick = (e) => {
  startRecording();
  startBtn.innerText = "Recording";
};

const stopBtn = document.getElementById("stopBtn");

stopBtn.onclick = (e) => {
  mediaRecorder.stop();
  startBtn.innerText = "Start";
};

async function startRecording() {
  // Specify the media sources to record from
  const constraints = {
    audio: true,
    video: false,
  };

  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "audio/webm",
  });
  mediaRecorder.ondataavailable = onDataAvailable;
  mediaRecorder.onstop = stopRecording;
  mediaRecorder.start();
}

function onDataAvailable(e) {
  recordedChunks.push(e.data);
}

async function stopRecording() {
  videoElement.srcObject = null;

  const blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });

  const buffer = Buffer.from(await blob.arrayBuffer());
  recordedChunks = [];

  const { canceled, filePath } = await ipcRenderer.invoke("showSaveDialog");
  if (canceled) return;

  if (filePath) {
    writeFile(filePath, buffer, () => console.log("video saved successfully!"));
  }
}
