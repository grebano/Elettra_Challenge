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

void readTemperature(DallasTemperature &sensors, SensorsData &sensorsData) {
    sensors.requestTemperatures();
    sensorsData.setTemperature(sensors.getTempCByIndex(0), 0);
    sensorsData.setTemperature(sensors.getTempCByIndex(1), 1);
}