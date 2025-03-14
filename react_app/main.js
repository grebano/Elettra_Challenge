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
  mqttCallback((mqttString) =>
    mainWindow.webContents.send("mqtt-data-request", mqttString)
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

const handleCentralinaMessage = (jsonData, topic) => {
  if (jsonData && jsonData.ws) {
    const centralina_tmp = {
      ...jsonData,
      conf: hashMapCentraline.get(jsonData.sname),
    };

    if (!centralina_tmp.conf || centralina_tmp.conf.enabled) {
      setCentraline((currentData) => {
        let array = [...currentData];

        try {
          let existing = array.find(
            (cen) => cen.sname === centralina_tmp.sname
          );
          if (!existing) {
            let icon = getIcon(filterSelected, centralina_tmp);
            let marker = L.marker([centralina_tmp.lat, centralina_tmp.lon], {
              icon,
            });
            let popup = getPopup(centralina_tmp, filterSelected);

            if (popup && marker && layerGroup && icon) {
              marker.bindPopup(popup);
              centralina_tmp.marker = marker;
              layerGroup.addLayer(marker);
              array.push(centralina_tmp);
            }
          } else if (!existing.maker) {
            array = array.filter((cen) => cen.sname !== existing.sname);

            let icon = getIcon(filterSelected, centralina_tmp);
            let marker = L.marker([centralina_tmp.lat, centralina_tmp.lon], {
              icon,
            });
            let popup = getPopup(centralina_tmp, filterSelected);

            if (popup && marker && layerGroup && icon) {
              marker.bindPopup(popup);
              centralina_tmp.marker = marker;
              layerGroup.addLayer(marker);
              array.push(centralina_tmp);
            }
          } else {
            existing.marker.setIcon(getIcon(filterSelected, centralina_tmp));
            existing.marker.bindPopup(getPopup(centralina_tmp, filterSelected));
          }
        } catch (e) {
          console.error("Error in handleCentralinaMessage", e);
        }
        return array;
      });
    }
  }
};
