#include "GPS.h"

// Create software serial for GPS
SoftwareSerial gpsSerial(GPS_RX_PIN, GPS_TX_PIN);

void initGPS() {
    // Begin serial communication
    gpsSerial.begin(GPS_BAUD_RATE);
    
    // Optional: Add a small delay to ensure GPS module is ready
    delay(100);
}

void readGPSData(TinyGPSPlus &gps) {
    // Read data from GPS serial port
    while (gpsSerial.available() > 0) {
        char c = gpsSerial.read();
        gps.encode(c);
    }
}

void readGPSData(TinyGPSPlus &gps, SensorsData &sensorsData) {
    // Read data from GPS serial port
    while (gpsSerial.available() > 0) {
        char c = gpsSerial.read();
        gps.encode(c);
    }

    sensorsData.setGPS(
        gps.location.lat(),
        gps.location.lng(),
        gps.altitude.meters(),
        gps.speed.kmph(),
        gps.course.deg(),
        gps.satellites.value(),
        gps.date.year(),
        gps.date.month(),
        gps.date.day(),
        gps.time.hour(),
        gps.time.minute(),
        gps.time.second(),
        gps.location.isValid()
    );
}