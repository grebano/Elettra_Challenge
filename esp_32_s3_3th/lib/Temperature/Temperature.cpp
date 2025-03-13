#include "Temperature.h"

const int oneWireBus = 4;
OneWire oneWire(oneWireBus);

void initTemperatureSensors(DallasTemperature &sensors) {
    sensors.setOneWire(&oneWire);
    sensors.begin();
}

float readTemperature(DallasTemperature &sensors) {
    sensors.requestTemperatures();
    return sensors.getTempCByIndex(0);
}
