#ifndef GPS_H
#define GPS_H

#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <SensorsData.h>
#include <ArduinoJson.h>

// Define GPS baud rate
#define GPS_BAUD_RATE 9600

// Declare external GPS serial object
extern SoftwareSerial gpsSerial;

void initGPS();
void readGPSData(TinyGPSPlus &gps);
void readGPSData(String &gps);
void readGPSData(TinyGPSPlus &gps, SensorsData &sensorsData);

const String ExampleGPSData = "$GPGGA,092750.000,5321.6802,N,00630.3372,W,1,8,1.03,61.7,M,55.2,M,,*76"
							  "$GPGSA,A,3,10,07,05,02,29,04,08,13,,,,,1.72,1.03,1.38*0A"
							  "$GPGSV,3,1,11,10,63,137,17,07,61,098,15,05,59,290,20,08,54,157,30*70"
							  "$GPGSV,3,2,11,02,39,223,19,13,28,070,17,26,23,252,,04,14,186,14*79"
							  "$GPGSV,3,3,11,29,09,301,24,16,09,020,,36,,,*76"
							  "$GPRMC,092750.000,A,5321.6802,N,00630.3372,W,0.02,31.66,280511,,,A*43";

#endif // GPS_H