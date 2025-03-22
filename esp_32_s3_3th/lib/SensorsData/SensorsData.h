#ifndef SENSORSDATA_H
#define SENSORSDATA_H

#include <Arduino.h>

class SensorsData {

public:

    SensorsData();

        // GPS data
        struct GPSData {
          float latitude;
          float longitude;
          float altitude;
          float speed;
          float course;
          uint32_t satellites;
          uint16_t year;
          uint8_t month;
          uint8_t day;
          uint8_t hour;
          uint8_t minute;
          uint8_t second;
          bool isValid;
          
          String toString() const;
      };

    float getTemperature(int index);
    void setTemperature(float temperature, int index);
    GPSData getGPS();
    void setGPS(GPSData gpsData);

private:
    float temperature[2];
    GPSData gpsData;
};

#endif // SENSORSDATA_H