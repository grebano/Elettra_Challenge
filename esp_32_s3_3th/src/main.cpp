#include "SDCard.h"
#include "GPS.h"
#include "Temperature.h"
#include "SensorsData.h"
#include "MQTT.h"

//┌─────────────────────────────────┐
//│ SPI BUS                         │
//├─────────────┬───────────────────┤
#define SCK     GPIO_NUM_7  // Clock
#define MISO    GPIO_NUM_5  // Master In
#define MOSI    GPIO_NUM_6  // Master Out
#define CS      GPIO_NUM_4  // Chip Select
//└─────────────┴───────────────────┘

//┌─────────────────────────────────┐
//│ GPS RX/TX                      │
//├─────────────┬───────────────────┤
#define GPS_RX_PIN GPIO_NUM_18  // Connect to TX of GPS module
#define GPS_TX_PIN GPIO_NUM_15  // Connect to RX of GPS module
//└─────────────┴───────────────────┘

//┌─────────────────────────────────┐
//│ DS18B20 Temperature Sensor      │
//├─────────────┬───────────────────┤
#define DS18B20_PIN GPIO_NUM_17  // Connect to DATA of DS18B20
//└─────────────┴───────────────────┘

//┌─────────────────────────────────┐
//#define SIMULATED_MEASUREMENT
//└─────────────────────────────────┘

//┌─────────────────────────────────┐
#define ACTIVATE_COMMUNICATION
//└─────────────────────────────────┘

//┌─────────────────────────────────┐
//│ ETHERNET CLIENT                  │
//├─────────────┬───────────────────┤
#define ETHERNET_CS_PIN  GPIO_NUM_14  // Chip Select for Ethernet module
#define ETHERNET_RST_PIN GPIO_NUM_9   // Reset pin for Ethernet module
#define ETHERNET_INT_PIN GPIO_NUM_10  // Interrupt pin for Ethernet module
//├─────────────────────────────────┤
#define ETHERNET_MOSI_PIN GPIO_NUM_11 // MOSI pin for Ethernet module
#define ETHERNET_MISO_PIN GPIO_NUM_12 // MISO pin for Ethernet module
#define ETHERNET_CLK_PIN  GPIO_NUM_13 // SCK pin for Ethernet module
//└─────────────┴───────────────────┘

//───────────────────────────────────────────────────────────────────────────────────────────────────
// GPS setup
TinyGPSPlus gps;
SoftwareSerial gpsSerial(GPS_RX_PIN, GPS_TX_PIN);

// Temperature sensor setup
OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);

// Sensor data
SensorsData sensorsData = SensorsData();

#ifdef ACTIVATE_COMMUNICATION
// Ethernet Configuration
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xEF};
W5500Driver w5500(ETHERNET_CS_PIN, ETHERNET_INT_PIN, ETHERNET_RST_PIN);
EthernetClient ethClient;
SPIClass ethernetSPI(HSPI);

// MQTT Configuration
const char *mqtt_server = "test.mosquitto.org"; // Public MQTT broker
const int   mqtt_port   = 1883;                    // Default MQTT port
const char *mqtt_topic  = "TX000AA";              // MQTT topic to publish to

// MQTT Handler
MQTTHandler mqttHandler(ethClient);

// JSON document
JsonDocument jsonDoc;
#endif // ACTIVATE_COMMUNICATION

//───────────────────────────────────────────────────────────────────────────────────────────────────

void setup() 
{
    Serial.begin(115200);

    // Initialize SD card --------------------------------------
    SPI.begin(SCK, MISO, MOSI, CS);
    if (!SD.begin(CS)) 
    {
        // TODO handle error
        return;
    }
    
    deleteAllFiles(SD, "/Logs");
    createDir(SD, "/Logs");   

    appendFile(SD, "/Logs/event.txt", "Device started\n");
    appendFile(SD, "/Logs/event.txt", "SD card mounted\n");

    // Initialize GPS -------------------------------------------
    initGPS();

    // Initialize temperature sensors----------------------------
    sensors.begin();
    String feed = "Number of temperature sensors: " + String(sensors.getDS18Count()) + "\n";
    appendFile(SD, "/Logs/event.txt", feed.c_str());

    #ifdef ACTIVATE_COMMUNICATION
    // Add this before Ethernet initialization
    pinMode(ETHERNET_RST_PIN, OUTPUT);
    digitalWrite(ETHERNET_RST_PIN, LOW);
    delay(50);  // Hold reset for 50ms
    digitalWrite(ETHERNET_RST_PIN, HIGH);
    delay(250); // Give it time to initialize (W5500 needs ~150-200ms)

    // Setup Ethernet -------------------------------------------
    ethernetSPI.begin(ETHERNET_CLK_PIN, ETHERNET_MISO_PIN, ETHERNET_MOSI_PIN, ETHERNET_CS_PIN);
    Ethernet.init(w5500);
    bool ethOK = Ethernet.begin(mac);
    feed = "Ethernet connected: " + String(ethOK ? "true" : "false") + "\n";
    appendFile(SD, "/Logs/event.txt", feed.c_str());

    // Initialize MQTT ------------------------------------------
    mqttHandler.setServer(mqtt_server, mqtt_port);
    appendFile(SD, "/Logs/event.txt", "MQTT server set\n");
    #endif // ACTIVATE_COMMUNICATION
}

//───────────────────────────────────────────────────────────────────────────────────────────────────

void loop() 
{
    #ifdef SIMULATED_MEASUREMENT

    // Simulate GPS data
    String gpsData = ExampleGPSData;
    SensorsData.setTemperature(0, 25.0);
    SensorsData.setTemperature(1, 26.0);

    #else

    // Read GPS data
    String gpsData;
    readGPSData(gpsData);
    // Read temperature data
    readTemperature(sensors, sensorsData);

    #endif // SIMULATED_MEASUREMENT

    // Then perform specific logs
    if (gpsData.length() > 0)
    {
        appendFile(SD, "/Logs/gps.txt", gpsData.c_str());
    }

    for (int i = 0; i < 2; i++) 
    {
        if (sensorsData.getTemperature(i) != DEVICE_DISCONNECTED_C) 
        {
            String temperature = String(sensorsData.getTemperature(i)) + " C\n";
            String path = "/Logs/temperature" + String(i) + ".txt";
            appendFile(SD, path.c_str(), temperature.c_str());
            rotateLogFile(SD, path.c_str(), 1024 * 1024, 5);
        }
    }

    #ifdef ACTIVATE_COMMUNICATION
    // Publish data to MQTT
    mqttHandler.reconnect("ESP32-S3-Ethernet");
    mqttHandler.loop();

    // Create JSON data
    jsonDoc.clear();
    generateRandomData(jsonDoc);

    // Publish JSON data to MQTT topic
    mqttHandler.publish(mqtt_topic, jsonDoc);
    #endif // ACTIVATE_COMMUNICATION

    delay(20);
}
