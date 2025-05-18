const fetch = require("node-fetch");
const resources = require("../resources/resources");
const settings = resources("settings");
const { sendEvent } = require("../events/events");

// Default configuration
const DEFAULT_CONFIG = {
  postStrategy: {
    mode: "MESSAGE", // 'INTERVAL' or 'MESSAGE'
    intervalMs: 500,
  },
};

// State management
let postInterval = null;
let currentData = {};
let isInitialized = false;

function initialize() {
  if (isInitialized) {
    sendEvent({
      type: "info",
      code: "grafana-already-initialized",
      message: "GRAFANA - Already initialized",
      time: new Date().toUTCString(),
    });
    return;
  }

  try {
    if (!settings?.grafana?.url) {
      throw new Error("GRAFANA - URL is required");
    }

    if (!settings?.grafana?.team) {
      throw new Error("GRAFANA - Team is required");
    }

    // Apply defaults
    settings.grafana = {
      ...DEFAULT_CONFIG,
      ...settings.grafana,
      postStrategy: {
        ...DEFAULT_CONFIG.postStrategy,
        ...(settings.grafana.postStrategy || {}),
      },
    };

    settings.grafana.postStrategy.mode =
      settings.grafana.postStrategy.mode.toUpperCase();

    // Post strategy
    if (!["INTERVAL", "MESSAGE"].includes(settings.grafana.postStrategy.mode)) {
      throw new Error(
        `Invalid post strategy mode: ${settings.grafana.postStrategy.mode}`
      );
    }

    // Validate interval
    if (settings.grafana.postStrategy.mode === "INTERVAL") {
      if (
        !settings.grafana.postStrategy.intervalMs ||
        settings.grafana.postStrategy.intervalMs <= 0
      ) {
        sendEvent({
          type: "warning",
          code: "grafana-config",
          message: "GRAFANA - Invalid interval, using default 500ms",
          time: new Date().toUTCString(),
        });
        settings.grafana.postStrategy.intervalMs = 500;
      }
    }

    // Start interval
    if (settings.grafana.postStrategy.mode === "INTERVAL") {
      postInterval = setInterval(
        () => postToGrafana(currentData),
        settings.grafana.postStrategy.intervalMs
      );
    }

    isInitialized = true;
    sendEvent({
      type: "info",
      code: "grafana-init",
      message: `GRAFANA - Initialized with URL: ${settings.grafana.url}`,
      time: new Date().toUTCString(),
    });
  } catch (error) {
    sendEvent({
      type: "error",
      code: "grafana-init-error",
      message: `GRAFANA - Initialization error: ${error.message}`,
      time: new Date().toUTCString(),
    });
  }
}

function stop() {
  if (postInterval) {
    clearInterval(postInterval);
    postInterval = null;
  }
  isInitialized = false;
  sendEvent({
    type: "info",
    code: "grafana-stopped",
    message: "GRAFANA - Stopped",
    time: new Date().toUTCString(),
  });
}

function restart() {
  stop();
  setTimeout(() => {
    initialize();
  }, 1000);
}

function formatData(data) {
  currentData = {
    unige_temp1: data.temperature1,
    unige_temp2: data.temperature2,
    unige_temp3: data.temperature3,
    unige_temp4: data.temperature4,
    unige_temp5: data.temperature5,
    unige_temp6: data.temperature6,
    unige_temp7: data.temperature7,
    unige_soc: data.soc,
    unige_motor_power: data.motor_power,
    unige_lat: data.latitude,
    unige_lon: data.longitude,
    unige_gen1: data.gen1,
    unige_gen2: data.gen2,
    unige_gen3: data.gen3,
    team: settings.grafana.team,
  };
}

async function postToGrafana() {
  if (!isInitialized) {
    sendEvent({
      type: "error",
      code: "grafana-error",
      message: "GRAFANA - Not initialized",
      time: new Date().toUTCString(),
    });
    return;
  }

  if (!currentData || Object.keys(currentData).length === 0) {
    sendEvent({
      type: "warning",
      code: "grafana-no-data",
      message: "GRAFANA - No data to post",
      time: new Date().toUTCString(),
    });
    return;
  }

  try {
    const response = await fetch(settings.grafana.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentData),
    });

    if (!response.ok) {
      throw new Error(
        `GRAFANA - HTTP error: ${response.status} ${response.statusText}`
      );
    }

    sendEvent({
      type: "success",
      code: "grafana-post",
      message: "GRAFANA - Data posted successfully",
      time: new Date().toUTCString(),
    });
  } catch (error) {
    sendEvent({
      type: "error",
      code: "grafana-post-error",
      message: `GRAFANA - Error posting data: ${error.message}`,
      time: new Date().toUTCString(),
    });
  }
}

function cleanup() {
  if (postInterval) {
    clearInterval(postInterval);
    postInterval = null;
  }
  isInitialized = false;
}

module.exports = {
  initializeGrafana: initialize,
  stopGrafana: stop,
  restartGrafana: restart,
  updateGrafana: (data) => {
    formatData(data);
    if (isInitialized && settings.grafana.postStrategy.mode === "MESSAGE") {
      postToGrafana();
    }
  },
  cleanupGrafana: cleanup,
};
