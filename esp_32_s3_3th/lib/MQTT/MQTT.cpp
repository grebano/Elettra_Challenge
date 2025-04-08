#include "MQTT.h"

MQTTHandler::MQTTHandler(EthernetClient &ethClient) : client(ethClient) {}

void MQTTHandler::setServer(const char *server, uint16_t port)
{
    client.setServer(server, port);
}

bool MQTTHandler::publish(const char *topic, JsonDocument &jsonDoc)
{
    char jsonBuffer[512];
    serializeJson(jsonDoc, jsonBuffer);
    return client.publish(topic, jsonBuffer);
}

void MQTTHandler::reconnect(const char *clientId)
{
    const unsigned long connectTimeout = 30000; // 30 seconds
    const unsigned long retryDelay = 5000;      // 5 seconds
    const int maxRetries = 5;                   // Maximum retries

    int retryCount = 0;
    unsigned long startAttemptTime = millis();

    while (!client.connected())
    {
        // Check if total connection time exceeded
        if (millis() - startAttemptTime >= connectTimeout)
        {
            Serial.println("MQTT connection attempts timed out");
            return;
        }

        // Check if max retries exceeded
        if (retryCount >= maxRetries)
        {
            Serial.println("Maximum MQTT connection attempts reached");
            return;
        }

        // Attempt to connect with optional username/password
        bool connectionResult = client.connect(clientId);

        if (connectionResult)
        {
            Serial.println("Connected successfully");
            return;
        }

        // Print specific error state
        switch (client.state())
        {
        case -4:
            Serial.println("Connection timeout");
            break;
        case -3:
            Serial.println("Connection lost");
            break;
        case -2:
            Serial.println("Connect failed");
            break;
        case -1:
            Serial.println("Disconnected");
            break;
        default:
            Serial.println("Connection failed");
            break;
        }

        // Increment retry count
        retryCount++;

        // Progressive backoff: increase delay with each retry
        unsigned long currentDelay = retryDelay * (retryCount + 1);

        delay(currentDelay);
    }
}
void MQTTHandler::loop()
{
    client.loop();
}

void generateRandomData(JsonDocument &jsonDoc)
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
}