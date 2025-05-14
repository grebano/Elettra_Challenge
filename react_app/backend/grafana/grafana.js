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
          message: "Using default interval of 500ms",
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
      message: `Grafana initialized in ${settings.grafana.postStrategy.mode} mode`,
      time: new Date().toUTCString(),
    });
  } catch (error) {
    sendEvent({
      type: "error",
      code: "grafana-init-error",
      message: `Initialization failed: ${error.message}`,
      time: new Date().toUTCString(),
    });
  }
}

async function postToGrafana() {
  if (!isInitialized) {
    sendEvent({
      type: "error",
      code: "grafana-error",
      message: "Attempted to post before initialization",
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
    /*const response = await fetch(settings.grafana.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...currentData,
        team: settings.grafana.team,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `GRAFANA - HTTP error: ${response.status} ${response.statusText}`
      );
    }*/

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
  updateData: (data) => {
    currentData = data;
    if (isInitialized && settings.grafana.postStrategy.mode === "MESSAGE") {
      postToGrafana();
    }
  },
  cleanupGrafana: cleanup,
};
