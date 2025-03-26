#ifndef GPS_H
#define GPS_H

#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <SensorsData.h>

// Define GPS pins
#define GPS_RX_PIN (GPIO_NUM_18)  // Connect to TX of GPS module
#define GPS_TX_PIN (GPIO_NUM_15)  // Connect to RX of GPS module
#define GPS_BAUD_RATE 9600

// Declare external GPS serial object
extern SoftwareSerial gpsSerial;

void initGPS();
void readGPSData(TinyGPSPlus &gps);
void readGPSData(String &gps);
void readGPSData(TinyGPSPlus &gps, SensorsData &sensorsData);

#endif // GPS_H