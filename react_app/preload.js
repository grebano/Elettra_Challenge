const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  GetMqttData: (callback) =>
    ipcRenderer.on("mqtt-data-request", (event, data) => callback(data)),
  GetEvents: (callback) =>
    ipcRenderer.on("event-data-request", (event, data) => callback(data)),
  StopGrafana: () =>
    ipcRenderer.send("stop-grafana", { message: "Stop Grafana" }),
  StartGrafana: () =>
    ipcRenderer.send("start-grafana", { message: "Start Grafana" }),
  RestartGrafana: () =>
    ipcRenderer.send("restart-grafana", { message: "Restart Grafana" }),
});
