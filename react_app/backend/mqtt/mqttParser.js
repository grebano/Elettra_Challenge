const path = require("path");
const mqttClient = require(path.join(__dirname, "mqtt"));
let mqttString = "";
let callback = () => {};
//let channel = "";

mqttClient.on("message", (topic, message) => {
  try {
    console.log(`Received message from topic ${topic}`);
    mqttString = JSON.parse(message.toString());
    //callback(channel, mqttString);
    callback(mqttString);
  } catch (error) {
    console.error(error);
  }
});

/*module.exports = (localCallback, localChannel) => {
  callback = localCallback;
  channel = localChannel;
};*/

module.exports = (localCallback) => {
  callback = localCallback;
};
