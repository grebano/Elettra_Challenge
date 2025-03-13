#ifndef GPS_H
#define GPS_H

#include <TinyGPS++.h>
#include <HardwareSerial.h>

void initGPS();
void readGPSData(TinyGPSPlus &gps);

#endif // GPS_H
