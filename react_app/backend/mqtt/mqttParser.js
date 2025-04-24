const path = require("path");
const mqttClient = require(path.join(__dirname, "mqtt"));

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

    console.log(`MqttParser - onMessage: received message from topic ${topic}`);
    mqttData = { ...mqttData, ...JSON.parse(message.toString()) };

    //Send data to frontend
    callback(mqttData);

    // Set a timeout to check if data stopped. 30 seconds is the default
    dataStoppedTimeout = setTimeout(() => {
      console.log("MqttParser - onMessage: setTimeout -> data stopped");
      mqttData.data_stopped = true;
      callback(mqttData);
    }, 30000);
  } catch (error) {
    mqttData.error = true;
    callback(mqttData);
    console.error("MqttParser - onMessage: error parsing message", error);
  }
});

mqttClient.on("error", (err) => {
  console.error("MqttParser - onError:", err);
  // Clear the timeout if a new error occurs
  if (dataErrorTimeout) {
    clearTimeout(dataErrorTimeout);
  }

  mqttData.error = true;
  callback(mqttData);

  // Keep the error message for 30 seconds
  dataErrorTimeout = setTimeout(() => {
    console.log("MqttParser - onError: setTimeout -> clear error message");
    mqttData.error = false;
    callback(mqttData);
  }, 30000);
});

mqttClient.on("close", () => {
  console.log("MqttParser - onClose: mqtt connection closed");
});

mqttClient.on("offline", () => {
  console.log("MqttParser - onOffline: mqtt client is offline");
  mqttData.offline = true;
  callback(mqttData);
});

mqttClient.on("reconnect", () => {
  console.log("MqttParser - onReconnect: mqtt client is trying to reconnect");
});

module.exports = (localCallback) => {
  callback = localCallback;
};
