#include <Arduino.h>
#include <TinyGPS++.h>
#include <DallasTemperature.h>
#include "SDCard.h"
#include "GPS.h"
#include "Temperature.h"

#define REASSIGN_PINS
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
DallasTemperature sensors;

void setup() {
    Serial.begin(115200);

      
    #ifdef REASSIGN_PINS
    SPI.begin(SCK, MISO, MOSI, CS);
    if (!SD.begin(CS)) {
    #else
    if (!SD.begin()) {
    #endif
        Serial.println("Card Mount Failed");
        return;
    }
    uint8_t cardType = SD.cardType();
    
    if (cardType == CARD_NONE) {
        Serial.println("No SD card attached");
        return;
    }
    
    Serial.print("SD Card Type: ");
    if (cardType == CARD_MMC) {
        Serial.println("MMC");
    } else if (cardType == CARD_SD) {
        Serial.println("SDSC");
    } else if (cardType == CARD_SDHC) {
        Serial.println("SDHC");
    } else {
        Serial.println("UNKNOWN");
    }
    
    uint64_t cardSize = SD.cardSize() / (1024 * 1024);
    Serial.printf("SD Card Size: %lluMB\n", cardSize);
    
    listDir(SD, "/", 0);
    createDir(SD, "/Logs");


    initGPS();
    initTemperatureSensors(sensors);
}

void loop() {
    // Read GPS data
    readGPSData(gps);
    if (gps.location.isUpdated()) {
        Serial.printf("Latitude= %.6f Longitude= %.6f\n", gps.location.lat(), gps.location.lng());
    }

    // Read temperature data
    float temperatureC = readTemperature(sensors);
    Serial.printf("Temperature: %.2f C\n", temperatureC);

    // Save data to SD card
    char data[128];
    snprintf(data, sizeof(data), "Latitude= %.6f Longitude= %.6f Temperature= %.2f C\n", gps.location.lat(), gps.location.lng(), temperatureC);

    //log data in comprehensive file
    appendFile(SD, "/Logs/data.txt", data);

    // Then perform specific logs
    if (gps.location.isUpdated()) {
        appendFile(SD, "/Logs/latitude.txt", String(gps.location.lat()).c_str());
        appendFile(SD, "/Logs/longitude.txt", String(gps.location.lng()).c_str());
    }
    if (temperatureC != DEVICE_DISCONNECTED_C) {
        appendFile(SD, "/Logs/temperature.txt", String(temperatureC).c_str());
    }

    delay(2000);
}
