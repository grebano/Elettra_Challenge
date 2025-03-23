const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  GetMqttData: (callback) =>
    ipcRenderer.on("mqtt-data-request", (event, data) => callback(data)),
});
