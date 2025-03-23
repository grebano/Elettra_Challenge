#ifndef TEMPERATURE_H
#define TEMPERATURE_H

#include <OneWire.h>
#include <DallasTemperature.h>

void readTemperature(DallasTemperature &sensors, SensorsData &sensorsData);

#endif // TEMPERATURE_H
