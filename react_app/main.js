const { app, BrowserWindow } = require("electron");
const path = require("path");
const mqttCallback = require(path.join(
  __dirname,
  "backend",
  "mqtt",
  "mqttParser"
));
const { eventCallback, sendEvent } = require(path.join(
  __dirname,
  "backend",
  "logs",
  "logs"
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
  try {
    Object.keys(windows).forEach((windowName) => {
      // More robust check to ensure window isn't destroyed
      const win = windows[windowName];
      if (win && !win.isDestroyed() && !win.webContents.isDestroyed()) {
        win.webContents.send("mqtt-data-request", data);
      } else if (win && (win.isDestroyed() || win.webContents.isDestroyed())) {
        // Clean up destroyed window references
        console.log(`Removing reference to destroyed window: ${windowName}`);
        delete windows[windowName];
      }
    });
  } catch (error) {
    console.error("Error sending MQTT data to windows:", error);
  }
});

// Callback for sending events to the logs window
eventCallback((data) => {
  try {
    if (windows.logs) {
      // Check if the logs window is destroyed before sending data
      if (
        !windows.logs.isDestroyed() &&
        !windows.logs.webContents.isDestroyed()
      ) {
        windows.logs.webContents.send("event-request", data);
      } else {
        // Clean up destroyed window reference
        console.log("Removing reference to destroyed logs window");
        delete windows.logs;
      }
    }
  } catch (error) {
    console.error("Error sending event data to windows:", error);
  }
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
        sandbox: true,
        webSecurity: true,
      },
    });

    // Add window close event to clean up references
    windows[window].on("closed", () => {
      console.log(`Window ${window} closed, removing reference`);
      delete windows[window];
    });

    if (process.env.NODE_ENV === "development") {
      windows[window].loadURL("http://localhost:5173#/" + window);
      windows[window].webContents.openDevTools();
    } else {
      // Fix path for production - use current directory instead of "../build"
      const indexPath = path.join(__dirname, "./build/index.html");
      console.log("Loading from path:", indexPath);
      windows[window].loadURL(`file://${indexPath}#/${window}`);

      // Temporarily enable DevTools in production for debugging
      windows[window].webContents.openDevTools();

      // Log any errors that occur during page load
      windows[window].webContents.on(
        "did-fail-load",
        (event, errorCode, errorDescription) => {
          console.error("Page failed to load:", errorCode, errorDescription);
        }
      );
    }

    // Set Content Security Policy
    windows[window].webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        // Force development CSP for localhost URLs or if FORCE_DEV_CSP is set
        const isLocalhost =
          details.url.includes("localhost") ||
          details.url.includes("127.0.0.1") ||
          details.url.startsWith("file://");

        const isDev =
          process.env.NODE_ENV === "development" ||
          process.env.FORCE_DEV_CSP === "true" ||
          isLocalhost;

        // Log the CSP environment mode for debugging
        /*console.log(
          "CSP Environment mode:",
          isDev ? "development" : "production",
          `(for URL: ${details.url.substring(0, 50)}...)`
        );*/

        // Development CSP allows all image sources with "*"
        const cspValue = isDev
          ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *; font-src 'self'; connect-src 'self' ws: wss: *;"
          : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.openstreetmap.org *.tile.openstreetmap.org *.global.ssl.fastly.net *.mapbox.com *.leafletjs.com *.basemaps.cartocdn.com *.cartodb.com *.google.com *.googleapis.com *.gstatic.com *.bing.com *.virtualearth.net *.arcgisonline.com *.mapquest.com *.here.com *.jawg.io; font-src 'self'; connect-src 'self' ws: wss: *.openstreetmap.org *.tile.openstreetmap.org *.global.ssl.fastly.net *.mapbox.com *.leafletjs.com *.basemaps.cartocdn.com *.cartodb.com *.google.com *.googleapis.com *.gstatic.com *.bing.com *.virtualearth.net *.arcgisonline.com *.mapquest.com *.here.com *.jawg.io;";

        callback({
          responseHeaders: {
            ...details.responseHeaders,
            "Content-Security-Policy": [cspValue],
          },
        });
      }
    );

    // Log blocked content
    windows[window].webContents.session.webRequest.onErrorOccurred(
      (details) => {
        if (details.error === "net::ERR_BLOCKED_BY_CLIENT") {
          console.error("CSP Blocked URL:", details.url);
        }
      }
    );
  }

  return windows[window];
}
