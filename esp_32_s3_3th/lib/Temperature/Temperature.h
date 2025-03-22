#ifndef TEMPERATURE_H
#define TEMPERATURE_H

#include <OneWire.h>
#include <DallasTemperature.h>

float readTemperature(DallasTemperature &sensors);

#endif // TEMPERATURE_H
