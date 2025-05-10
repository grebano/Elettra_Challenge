const mqtt = require("mqtt");
const resources = require("../resources/resources");
const settings = resources("settings");
let client;

if (!client) {
  client = mqtt.connect(`mqtt://${settings.mqtt.host}`, {
    reconnectPeriod: 5000,
    clientId: "elettra-unige_" + Math.random().toString(16).slice(3),
  });

  client.subscribe(`${settings.mqtt.topic}`, () => {
    console.log(`Subscribed to topic ${settings.mqtt.topic}`);
  });
}

module.exports = client;
