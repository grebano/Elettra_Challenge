#include "Temperature.h"

/*
 * DS18B20 Temperature Sensor Connection Diagram
 *
 * ESP32/MCU                DS18B20
 *   3.3V/5V o-------------o VCC
 *                |
 *                |
 *                | 4.7kΩ Pull-up Resistor
 *                |
 *                |
 *   GPIO Pin o---+--------o DATA
 *
 *   GND     o-------------o GND
 *
 * Notes:
 * - The 4.7kΩ pull-up resistor is required for reliable communication
 * - DS18B20 can be powered in "parasite power" mode by connecting
 *   VCC to GND and using only the DATA line for both power and data
 */

void readTemperature(DallasTemperature &sensors, SensorsData &sensorsData)
{
    sensors.requestTemperatures();

    for (int i = 0; i < 5; i++)
    {
        sensorsData.setTemperature(sensors.getTempCByIndex(i), i);
    }
}

float readTemperature(DallasTemperature &sensors, uint8_t index)
{
    uint8_t count = sensors.getDS18Count();
    index = (index >= count) ? count - 1 : index;
    sensors.requestTemperatures();
    return sensors.getTempCByIndex(index);
}

void readTemperature(DallasTemperature &sensors, float &temperature, uint8_t index)
{
    sensors.requestTemperatures();
    temperature = sensors.getTempCByIndex(index);
}

String getTemperatureString(DallasTemperature &sensors, uint8_t index)
{
    sensors.requestTemperatures();
    return String(sensors.getTempCByIndex(index));
}

uint8_t getDS18Count(DallasTemperature &sensors)
{
    return sensors.getDS18Count();
}