#include <Arduino.h>
#include <TinyGPS++.h>
#include <DallasTemperature.h>
#include "SDCard.h"
#include "GPS.h"
#include "Temperature.h"

// GPS setup
TinyGPSPlus gps;

// Temperature sensor setup
DallasTemperature sensors;

void setup() {
    Serial.begin(115200);
    initGPS();
    initSDCard();
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
    saveDataToSDCard(data);

    delay(2000);
}
