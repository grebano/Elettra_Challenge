#include "SDCard.h"
#include "GPS.h"
#include "Temperature.h"
#include "SensorsData.h"

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

//───────────────────────────────────────────────────────────────────────────────────────────────────
// GPS setup
TinyGPSPlus gps;
SoftwareSerial gpsSerial(GPS_RX_PIN, GPS_TX_PIN);

// Temperature sensor setup
OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);

// Sensor data
SensorsData sensorsData = SensorsData();

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
    String count = "Number of temperature sensors: " + String(sensors.getDS18Count()) + "\n";
    appendFile(SD, "/Logs/event.txt", count.c_str());
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

    delay(200);
}
