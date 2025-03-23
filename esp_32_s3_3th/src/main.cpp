#include "SDCard.h"
#include "GPS.h"
#include "Temperature.h"
#include "SensorsData.h"

#define REASSIGN_SD_PINS
//┌─────────────────────────────────┐
//│ SPI BUS                         │
//├─────────────┬───────────────────┤
#define SCK     GPIO_NUM_7  // Clock
#define MISO    GPIO_NUM_5  // Master In
#define MOSI    GPIO_NUM_6  // Master Out
#define CS      GPIO_NUM_4  // Chip Select
//└─────────────┴───────────────────┘

// GPS setup
TinyGPSPlus gps;

// Temperature sensor setup
OneWire oneWire(GPIO_NUM_17);
DallasTemperature sensors(&oneWire);

// Sensor data
SensorsData sensorsData = SensorsData();

void setup() 
{
    Serial.begin(115200);

    // Initialize SD card -------------------------------------------
    #ifdef REASSIGN_SD_PINS
    SPI.begin(SCK, MISO, MOSI, CS);
    if (!SD.begin(CS)) {
    #else
    if (!SD.begin()) {
    #endif
        return;
    }
    
    deleteAllFiles(SD, "/Logs");
    createDir(SD, "/Logs");   

    appendFile(SD, "/Logs/event.txt", "Device started\n");
    // ---------------------------------------------------------------

    // Initialize GPS
    initGPS();

    // Initialize temperature sensors
    sensors.begin();
}

void loop() 
{
    // Read GPS data
    readGPSData(gps, sensorsData);

    // Read temperature data
    readTemperature(sensors, sensorsData);

    // Then perform specific logs
    if (gps.location.isUpdated()) 
    {
        appendFile(SD, "/Logs/latitude.txt", String(gps.location.lat()).c_str());
        appendFile(SD, "/Logs/longitude.txt", String(gps.location.lng()).c_str());
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
