#ifndef MQTT_HANDLER_H
#define MQTT_HANDLER_H

#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <EthernetESP32.h>

class MQTTHandler
{
public:
    MQTTHandler(EthernetClient &ethClient);

    void setServer(const char *server, uint16_t port);
    bool publish(const char *topic, JsonDocument &jsonDoc);
    void reconnect(const char *clientId);
    void loop();

private:
    PubSubClient client;
};

/**
 * @brief function to generate random data for testing purposes
 *
 * @return JsonDocument
 */
void generateRandomData(JsonDocument &jsonDoc);

#endif