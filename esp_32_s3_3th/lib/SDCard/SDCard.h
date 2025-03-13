#ifndef SDCARD_H
#define SDCARD_H

#include <Arduino.h>
#include <SD.h>

void initSDCard();
void saveDataToSDCard(const char* data);

#endif // SDCARD_H
