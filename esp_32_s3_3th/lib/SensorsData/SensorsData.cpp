#include <SensorsData.h>

// Constructor for the SensorsData class
SensorsData::SensorsData() 
{
    temperature[0] = 0.0;
    temperature[1] = 0.0;
    
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
    return this->temperature[index];
}

float* SensorsData::getTemperature() 
{
    return this->temperature;
}

// Get the GPS data
SensorsData::GPSData SensorsData::getGPS() 
{
    return this->gpsData;
}

// Set the temperature
void SensorsData::setTemperature(float temperature, int index) 
{
    this->temperature[index] = temperature;
}

// Set the temperature
void SensorsData::setTemperature(float temperature[2]) 
{
    this->temperature[0] = temperature[0];
    this->temperature[1] = temperature[1];
}

// Set the GPS data
void SensorsData::setGPS(GPSData gpsData) 
{
    this->gpsData = gpsData;
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