const { app, BrowserWindow } = require("electron");
const { get } = require("http");
const path = require("path");
const mqttCallback = require(path.join(
  __dirname,
  "backend",
  "mqtt",
  "mqttParser"
));

module.exports = {
  getWindow: () => windows,
  createWindow: (window) => createWindow(window),
};

const menu = require(path.join(__dirname, "backend", "menu", "menu.js"));
require("dotenv").config({ path: ".env" });

const windows = {};

app.whenReady().then(() => {
  createWindow("live");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

mqttCallback((data) => {
  console.log(windows);
  Object.keys(windows).forEach((window) => {
    if (windows[window]) {
      windows[window].webContents.send("mqtt-data-request", data);
    }
  });
});

function createWindow(window = "live") {
  if (windows[window]) {
    windows[window].focus();
  } else {
    windows[window] = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    if (process.env.NODE_ENV === "development") {
      windows[window].loadURL("http://localhost:5173#/" + window);
      windows[window].webContents.openDevTools();
    } else {
      windows[window].loadURL(
        `file://${path.join(__dirname, "../build/index.html")}#/${window}`
      );
    }

    windows[window].on("closed", () => {
      windows[window] = null;
    });
  }

  return windows[window];
}
