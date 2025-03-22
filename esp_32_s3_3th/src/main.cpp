#include <TinyGPS++.h>

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

void setup() {

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

void loop() {
    // Read GPS data
    readGPSData(gps);
    if (gps.location.isUpdated()) {
        Serial.printf("Latitude= %.6f Longitude= %.6f\n", gps.location.lat(), gps.location.lng());
    }

    // Read temperature data
    sensors.requestTemperatures();
    sensorsData.setTemperature(sensors.getTempCByIndex(0),0);
    sensorsData.setTemperature(sensors.getTempCByIndex(1),1);


    // Then perform specific logs
    if (gps.location.isUpdated()) {
        appendFile(SD, "/Logs/latitude.txt", String(gps.location.lat()).c_str());
        appendFile(SD, "/Logs/longitude.txt", String(gps.location.lng()).c_str());
    }
    if (sensorsData.getTemperature(0) != DEVICE_DISCONNECTED_C) {
        String temperature = String(sensorsData.getTemperature(0)) + " C\n";
        appendFile(SD, "/Logs/temperature0.txt", temperature.c_str());
    }
    if (sensorsData.getTemperature(1) != DEVICE_DISCONNECTED_C) {
        String temperature = String(sensorsData.getTemperature(1)) + " C\n";
        appendFile(SD, "/Logs/temperature1.txt", temperature.c_str());
    }

    delay(200);
}
