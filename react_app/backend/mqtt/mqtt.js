const mqtt = require("mqtt");
const resources = require("../resources/resources");
const settings = resources("settings");
let client;

if (!client) {
  client = mqtt.connect(`mqtt://${settings.mqtt.host}`);

  client.subscribe(`${settings.mqtt.topic}`, () => {
    console.log(`Subscribed to topic ws/multedo`);
  });

  client.on('error', (err) => {
    console.error('Connection failed:', err);
  });

  client.on('close', () => {
    console.log('Connection to MQTT broker closed');
  });

  client.on('offline', () => {
    console.log('Client is offline');
  });
}

module.exports = client;
