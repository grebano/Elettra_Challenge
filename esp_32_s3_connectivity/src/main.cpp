#include <ArduinoJson.h>
#include <EthernetESP32.h>
#include "MQTT.h"

// Function prototypes
JsonDocument generateRandomData();

// Ethernet Configuration
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xEF};
W5500Driver w5500(14, 10, 9);

// Ethernet Client
EthernetClient ethClient;

// MQTT Configuration
const char *mqtt_server = "test.mosquitto.org"; // Public MQTT broker
const int mqtt_port = 1883;                     // Default MQTT port
const char *mqtt_topic = "TX000AA";             // MQTT topic to publish to

// MQTT Handler
MQTTHandler mqttHandler(ethClient);

// JSON document
JsonDocument jsonDoc;

void setup()
{
  // Initialize Serial communication
  Serial.begin(115200);
  delay(500);

  // Setup Ethernet
  Serial.println("Initializing Ethernet...");
  SPI.begin(13, 12, 11);
  Ethernet.init(w5500);
  Ethernet.begin(mac);
  delay(500);

  // Initialize MQTT
  mqttHandler.setServer(mqtt_server, mqtt_port);
  delay(500);
}

void loop()
{
  // Reconnect to MQTT broker if necessary
  mqttHandler.reconnect("ESP32-S3-Ethernet");

  // Client loop
  mqttHandler.loop();

  // Create JSON data
  jsonDoc.clear();
  jsonDoc = generateRandomData();

  // Publish JSON data to MQTT topic
  mqttHandler.publish(mqtt_topic, jsonDoc);

  // Wait before sending the next message
  delay(5000);
}

// Random data generation function
JsonDocument generateRandomData()
{
  // Coordinates bounds
  const float LAT_MIN = 43.0;
  const float LAT_MAX = 44.5;
  const float LON_MIN = 7.5;
  const float LON_MAX = 10.5;

  jsonDoc["device"] = "ESP32";
  jsonDoc["temperature"] = 20.0 + random(100) / 100.0 * 10.0;
  jsonDoc["battery_voltage"] = 3.0 + random(120) / 100.0;
  jsonDoc["battery_percentage"] = 20 + random(81);
  jsonDoc["inverter_temperature"] = 25.0 + random(260) / 10.0;
  jsonDoc["energy_torque"] = random(100) / 100.0;
  jsonDoc["motor_current"] = random(200) / 100.0;
  jsonDoc["lat"] = LAT_MIN + random(150) / 100.0;
  jsonDoc["lon"] = LON_MIN + random(300) / 100.0;

  // ESP32 memory usage
  jsonDoc["heap"] = ESP.getFreeHeap();

  return jsonDoc;
}