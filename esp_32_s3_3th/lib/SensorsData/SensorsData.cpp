#include <SensorsData.h>

// Constructor for the SensorsData class
SensorsData::SensorsData()
{
    temperature.values[0] = 0.0;
    temperature.values[1] = 0.0;
    temperature.values[2] = 0.0;
    temperature.values[3] = 0.0;
    temperature.values[4] = 0.0;
    temperature.values[5] = 0.0;

    gpsData.latitude = 0.0;
    gpsData.longitude = 0.0;
    gpsData.altitude = 0.0;
    gpsData.speed = 0.0;
    gpsData.course = 0.0;
    gpsData.satellites = 0;
    gpsData.year = 0;
    gpsData.month = 0;
    gpsData.day = 0;
    gpsData.hour = 0;
    gpsData.minute = 0;
    gpsData.second = 0;
    gpsData.isValid = false;
}

// Get the temperature
float SensorsData::getTemperature(int index)
{
    return this->temperature.values[index];
}

float *SensorsData::getTemperature()
{
    return this->temperature.values;
}

// Get the GPS data
SensorsData::GPSData SensorsData::getGPS()
{
    return this->gpsData;
}

// Set the temperature
void SensorsData::setTemperature(float temperature, int index)
{
    this->temperature.values[index] = temperature;
}

// Set the temperature
void SensorsData::setTemperature(float temperature[5])
{
    this->temperature.values[0] = temperature[0];
    this->temperature.values[1] = temperature[1];
    this->temperature.values[2] = temperature[2];
    this->temperature.values[3] = temperature[3];
    this->temperature.values[4] = temperature[4];
    this->temperature.values[5] = temperature[5];
}

// Set the GPS data
void SensorsData::setGPS(GPSData gpsData)
{
    this->gpsData = gpsData;
}

void SensorsData::setGPS(float latitude, float longitude, float altitude, float speed, float course, uint32_t satellites, uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t minute, uint8_t second, bool isValid)
{
    this->gpsData.latitude = latitude;
    this->gpsData.longitude = longitude;
    this->gpsData.altitude = altitude;
    this->gpsData.speed = speed;
    this->gpsData.course = course;
    this->gpsData.satellites = satellites;
    this->gpsData.year = year;
    this->gpsData.month = month;
    this->gpsData.day = day;
    this->gpsData.hour = hour;
    this->gpsData.minute = minute;
    this->gpsData.second = second;
    this->gpsData.isValid = isValid;
}

// Convert the GPS data to a string
String SensorsData::GPSData::toString() const
{
    String str = "Latitude: " + String(latitude, 6) + "\n";
    str += "Longitude: " + String(longitude, 6) + "\n";
    str += "Altitude: " + String(altitude) + " m\n";
    str += "Speed: " + String(speed) + " m/s\n";
    str += "Course: " + String(course) + " degrees\n";
    str += "Satellites: " + String(satellites) + "\n";
    str += "Date: " + String(year) + "/" + String(month) + "/" + String(day) + "\n";
    str += "Time: " + String(hour) + ":" + String(minute) + ":" + String(second) + "\n";
    str += "Valid: " + String(isValid) + "\n";
    return str;
}

// Convert SemsorsData to JSON
void SensorsData::toJson(JsonDocument &doc)
{
    doc["temperature1"] = this->temperature.values[0];
    doc["temperature2"] = this->temperature.values[1];
    doc["temperature3"] = this->temperature.values[2];
    doc["temperature4"] = this->temperature.values[3];
    doc["temperature5"] = this->temperature.values[4];
    doc["latitude"] = this->gpsData.latitude;
    doc["longitude"] = this->gpsData.longitude;
    doc["speed"] = this->gpsData.speed;
    doc["date"] = String(this->gpsData.year) + "-" + String(this->gpsData.month) + "-" + String(this->gpsData.day);
    doc["time"] = String(this->gpsData.hour) + ":" + String(this->gpsData.minute) + ":" + String(this->gpsData.second);
}
