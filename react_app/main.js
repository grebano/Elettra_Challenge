const { app, BrowserWindow } = require("electron");
const path = require("path");
const mqttCallback = require(path.join(
  __dirname,
  "backend",
  "mqtt",
  "mqttParser"
));
require("dotenv").config({ path: ".env" });

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  }

  //mqttCallback(mainWindow.webContents.send, "mqtt-data-request");
  mqttCallback((mqttData) =>
    mainWindow.webContents.send("mqtt-data-request", mqttData)
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
