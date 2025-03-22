#include "Temperature.h"


float readTemperature(DallasTemperature &sensors) {
    sensors.requestTemperatures();
    return sensors.getTempCByIndex(0);
}
