const { app, Menu } = require("electron");
const path = require("path");
const { createWindow } = require(path.join(__dirname, "..", "..", "main.js"));

const topMenu = [
  {
    label: "Live",
    click: () => {
      createWindow("live");
    },
  },
  {
    label: "Charts",
    click: () => {
      createWindow("charts");
    },
  },
  {
    label: "Logs",
    click: () => {
      createWindow("logs");
    },
  },
  {
    label: "Map",
    click: () => {
      createWindow("map");
    },
  },
  {
    label: "Exit",
    click: () => {
      app.quit();
    },
  },
];

const menu = Menu.buildFromTemplate(topMenu);
Menu.setApplicationMenu(menu);
