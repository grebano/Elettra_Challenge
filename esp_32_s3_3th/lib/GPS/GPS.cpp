#include "GPS.h"

#define GPS_TXD_PIN (GPIO_NUM_43)
#define GPS_RXD_PIN (GPIO_NUM_44)

void initGPS() {
    Serial1.begin(9600, SERIAL_8N1, GPS_RXD_PIN, GPS_TXD_PIN);
}

void readGPSData(TinyGPSPlus &gps) {
    while (Serial1.available() > 0) {
        gps.encode(Serial1.read());
    }
}
