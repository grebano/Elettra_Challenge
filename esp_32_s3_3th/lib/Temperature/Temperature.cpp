#include "Temperature.h"

float* readTemperature(DallasTemperature &sensors) {
    static float temperatures[2];  // Static makes this persist between function calls
    sensors.requestTemperatures();
    temperatures[0] = sensors.getTempCByIndex(0);
    temperatures[1] = sensors.getTempCByIndex(1);
    return temperatures;
}