const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  GetMqttData: (callback) =>
    ipcRenderer.on("mqtt-data-request", (event, data) => callback(data)),
  GetEvents: (callback) =>
    ipcRenderer.on("event-request", (event, data) => callback(data)),
});
