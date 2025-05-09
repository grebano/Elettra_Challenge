const path = require("path");
const mqttClient = require(path.join(__dirname, "mqtt"));
const { sendEvent } = require(path.join(__dirname, "..", "events", "events"));

let mqttData = {
  data_stopped: true,
};

let dataStoppedTimeout, dataErrorTimeout;
let callback = () => {};

mqttClient.on("message", (topic, message) => {
  try {
    // Reset the offline and stopped flags
    mqttData.offline = false;
    mqttData.data_stopped = false;

    // Clear the timeout if data is received
    if (dataStoppedTimeout) {
      clearTimeout(dataStoppedTimeout);
    }

    mqttData = { ...mqttData, ...JSON.parse(message.toString()) };

    sendEvent({
      type: "info",
      message: `MqttParser - onMessage: received message from topic ${topic}`,
      time: new Date().toUTCString(),
    });

    //Send data to frontend
    callback(mqttData);

    // Set a timeout to check if data stopped. 30 seconds is the default
    dataStoppedTimeout = setTimeout(() => {
      sendEvent({
        type: "warning",
        message: `MqttParser - onMessage: data stopped`,
        time: new Date().toUTCString(),
      });
      mqttData.data_stopped = true;
      callback(mqttData);
    }, 30000);
  } catch (error) {
    mqttData.error = true;
    callback(mqttData);

    sendEvent({
      type: "error",
      message: `MqttParser - onMessage: error parsing message ${error}`,
      time: new Date().toUTCString(),
    });
  }
});

mqttClient.on("error", (err) => {
  sendEvent({
    type: "error",
    message: `MqttParser - onError: ${err}`,
    time: new Date().toUTCString(),
  });

  // Clear the timeout if a new error occurs
  if (dataErrorTimeout) {
    clearTimeout(dataErrorTimeout);
  }

  mqttData.error = true;
  callback(mqttData);

  // Keep the error message for 30 seconds
  dataErrorTimeout = setTimeout(() => {
    mqttData.error = false;
    callback(mqttData);
  }, 30000);
});

// Event when the client is closed
mqttClient.on("close", () => {
  sendEvent({
    type: "warning",
    message: `MqttParser - onClose: mqtt connection closed`,
    time: new Date().toUTCString(),
  });
});

// Event when the client goes offline
mqttClient.on("offline", () => {
  sendEvent({
    type: "warning",
    message: `MqttParser - onOffline: mqtt client is offline`,
    time: new Date().toUTCString(),
  });
  mqttData.offline = true;
  callback(mqttData);
});

// Event when the client tries to reconnect
mqttClient.on("reconnect", () => {
  sendEvent({
    type: "info",
    message: `MqttParser - onReconnect: mqtt client is trying to reconnect`,
    time: new Date().toUTCString(),
  });
});

// Event when the client successfully connects to the broker
mqttClient.on("connect", () => {
  sendEvent({
    type: "success",
    message: `MqttParser - onConnect: mqtt client connected`,
    time: new Date().toUTCString(),
  });
});

module.exports = (localCallback) => {
  callback = localCallback;
};
