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