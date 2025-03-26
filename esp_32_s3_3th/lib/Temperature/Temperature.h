#ifndef TEMPERATURE_H
#define TEMPERATURE_H

#include <OneWire.h>
#include <DallasTemperature.h>
#include <SensorsData.h>


/**
 * @brief Reads temperature values from Dallas temperature sensors
 * @param sensors Reference to the DallasTemperature object that manages the sensors
 * @param sensorsData Reference to the data structure where temperature readings will be stored
 */
void readTemperature(DallasTemperature &sensors, SensorsData &sensorsData);

/**
 * @brief Reads temperature values from Dallas temperature sensors
 * @param sensors Reference to the DallasTemperature object that manages the sensors
 * @param index Index of the sensor to read
 * @return Temperature value in Celsius
 */
float readTemperature(DallasTemperature &sensors, uint8_t index);

/**
 * @brief Reads temperature values from Dallas temperature sensors
 * @param sensors Reference to the DallasTemperature object that manages the sensors
 * @param temperature Reference to the variable where the temperature value will be stored
 * @param index Index of the sensor to read
 */
void readTemperature(DallasTemperature &sensors, float &temperature, uint8_t index);

/**
 * @brief Reads temperature values from Dallas temperature sensors
 * @param sensors Reference to the DallasTemperature object that manages the sensors
 * @param index Index of the sensor to read
 * @return Temperature value in Celsius as a string
 */
String getTemperatureString(DallasTemperature &sensors, uint8_t index);

/**
 * @brief Gets the number of DS18B20 temperature sensors connected to the bus
 * @param sensors Reference to the DallasTemperature object that manages the sensors
 * @return Number of DS18B20 temperature sensors connected to the bus
 */
uint8_t getDS18Count(DallasTemperature &sensors);


#endif // TEMPERATURE_H
