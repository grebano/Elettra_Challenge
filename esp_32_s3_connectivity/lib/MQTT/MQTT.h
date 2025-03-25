#ifndef MQTT_HANDLER_H
#define MQTT_HANDLER_H

#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Ethernet.h>

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

#endif