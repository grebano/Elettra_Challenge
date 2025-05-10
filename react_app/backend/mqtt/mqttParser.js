const { set } = require("date-fns");
const path = require("path");
const mqttClient = require(path.join(__dirname, "mqtt"));
const { sendEvent } = require(path.join(__dirname, "..", "events", "events"));

let mqttData = {
  data_stopped: true,
};

let dataStoppedTimeout;
let callback = () => {};

mqttClient.on("message", (topic, message) => {
  try {
    // Clear the timeout if data is received
    if (dataStoppedTimeout) {
      clearTimeout(dataStoppedTimeout);
    }

    mqttData = { ...mqttData, ...JSON.parse(message.toString()) };

    sendEvent({
      type: "info",
      code: "mqtt-message",
      message: `MQTT - Received message on topic ${topic}: ${message.toString()}`,
      time: new Date().toUTCString(),
    });

    //Send data to frontend
    callback(mqttData);

    // Set a timeout to check if data stopped. 30 seconds is the default
    dataStoppedTimeout = setTimeout(() => {
      sendEvent({
        type: "warning",
        code: "mqtt-stopped",
        message: `MQTT - No data received for 30 seconds`,
        time: new Date().toUTCString(),
      });
    }, 30000);
  } catch (error) {
    sendEvent({
      type: "error",
      code: "mqtt-data-error",
      message: `MQTT - Error parsing message: ${error}`,
      time: new Date().toUTCString(),
    });
  }
});

mqttClient.on("error", (err) => {
  sendEvent({
    type: "error",
    code: "mqtt-error",
    message: `MQTT - Error: ${err}`,
    time: new Date().toUTCString(),
  });
});

// Event when the client is closed
mqttClient.on("close", () => {
  sendEvent({
    type: "warning",
    code: "mqtt-closed",
    message: `MQTT - Client closed`,
    time: new Date().toUTCString(),
  });
});

// Event when the client goes offline
mqttClient.on("offline", () => {
  sendEvent({
    type: "warning",
    code: "mqtt-offline",
    message: `MQTT - Client offline`,
    time: new Date().toUTCString(),
  });
});

// Event when the client tries to reconnect
mqttClient.on("reconnect", () => {
  sendEvent({
    type: "info",
    code: "mqtt-reconnect",
    message: `MQTT - Client reconnecting`,
    time: new Date().toUTCString(),
  });
});

// Event when the client successfully connects to the broker
mqttClient.on("connect", () => {
  sendEvent({
    type: "info",
    code: "mqtt-connected",
    message: `MQTT - Client connected`,
    time: new Date().toUTCString(),
  });
});

module.exports = (localCallback) => {
  callback = localCallback;
};
