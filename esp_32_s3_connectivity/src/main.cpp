#include <SPI.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <EthernetESP32.h>

// W5500 Ethernet module
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xEF};
W5500Driver driver(14, 10, 9);

// SPI interface
SPIClass SPI1(HSPI);

// Ethernet client
EthernetClient ethClient;

// MQTT broker details
const char *mqtt_server = "test.mosquitto.org"; // Public MQTT broker
const int mqtt_port = 1883;                     // Default MQTT port
const char *mqtt_topic = "TX000AA";             // MQTT topic to publish to

// JSON document
JsonDocument jsonDoc;

// MQTT client
PubSubClient client(ethClient);

// Function prototypes
void callback(char *topic, byte *payload, unsigned int length);
void reconnect();
float randomFloat(float min, float max);

void setup()
{
  // Initialize Serial communication
  Serial.begin(115200);
  delay(500);

  // Initialize SPI interface
  Serial.println("Initializing SPI...");
  SPI1.begin(13, 12, 11);
  delay(500);

  Serial.println("Initializing Ethernet...");
  driver.setSPI(SPI1);
  driver.setSpiFreq(10);
  driver.setPhyAddress(0);

  Ethernet.init(driver);

  delay(500);

  // Start Ethernet connection
  Ethernet.begin(mac);
  Serial.println("Ethernet connected");
  delay(500);

  // Configure MQTT server and callback
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Connect to MQTT broker
  if (client.connect("ESP32-S3-Ethernet-Client"))
  {
    Serial.println("Connected to MQTT broker");
  }
  else
  {
    Serial.println("Failed to connect to MQTT broker");
  }

  delay(500);
}

void loop()
{
  // Ensure the client is connected
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  // Create JSON data
  jsonDoc["device"] = "ESP32-S3-Ethernet";
  jsonDoc["temperature"] = 25.5;
  jsonDoc["humidity"] = 60.3;
  jsonDoc["lat"] = randomFloat(43.0, 44.5);
  jsonDoc["lon"] = randomFloat(7.5, 10.5);

  // Convert JSON to string
  char jsonBuffer[200];
  serializeJson(jsonDoc, jsonBuffer);

  // Publish JSON data to the topic
  if (client.publish(mqtt_topic, jsonBuffer))
  {
    Serial.println("JSON data published:");
    Serial.println(jsonBuffer);
  }
  else
  {
    Serial.println("Failed to publish JSON data");
  }

  // Wait before sending the next message
  delay(5000);
}

// MQTT callback function (not used in this example)
void callback(char *topic, byte *payload, unsigned int length)
{
  // Handle incoming messages (if needed)
}

// Reconnect to MQTT broker if disconnected
void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32-S3-Ethernet-Client"))
    {
      Serial.println("connected");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

float randomFloat(float min, float max)
{
  return min + (max - min) * (float)random(0, 1000000) / 999999.0;
}