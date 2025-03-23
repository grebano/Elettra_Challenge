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