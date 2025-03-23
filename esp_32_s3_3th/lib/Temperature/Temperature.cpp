#include "Temperature.h"
#include <SensorsData.h>

void readTemperature(DallasTemperature &sensors, SensorsData &sensorsData) {
    sensors.requestTemperatures();
    sensorsData.setTemperature(sensors.getTempCByIndex(0), 0);
    sensorsData.setTemperature(sensors.getTempCByIndex(1), 1);
}