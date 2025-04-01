#include "GPS.h"

// -----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----
//            . _..::__:  ,-"-"._        |7       ,     _,.__
//    _.___ _ _<_>`!(._`.`-.    /         _._     `_ ,_/  '  '-._.---.-.__
// >.{     " " `-==,',._\{  \  / {)      / _ ">_,-' `                mt-2_
//   \_.:--.       `._ )`^-. "'       , [_/(                       __,/-'
//  '"'     \         "    _L        oD_,--'                )     /. (|
//           |           ,'          _)_.\\._<> 6              _,' /  '
//           `.         /           [_/_'` `"(                <'}  )
//            \\    .-. )           /   `-'"..' `:.#          _)  '
//     `        \  (  `(           /         `:\  > \  ,-^.  /' '
//               `._,   ""         |           \`'   \|   ?_)  {\
//                  `=.---.        `._._       ,'     "`  |' ,- '.
//                    |    `-._         |     /          `:`<_|h--._
//                    (        >        .     | ,          `=.__.`-'\
//                     `.     /         |     |{|              ,-.,\     .
//                      |   ,'           \   / `'            ,"     \
//                      |  /              |_'                |  __  /
//                      | |                                  '-'  `-'   \.
//                      |/                                         "    /
//                      \.                                             '

//                       ,/            ______._.--._ _..---.---------._
//      ,-----"-..?----_/ )      __,-'"             "                  (
// -.._(                  `-----'                                       `-
// -----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----


void initGPS() {
    // Begin serial communication
    gpsSerial.begin(GPS_BAUD_RATE);
    
    // Optional: Add a small delay to ensure GPS module is ready
    delay(100);
}

void readGPSData(TinyGPSPlus &gps) {
    // Read data from GPS serial port
    while (gpsSerial.available() > 0) {
        char c = gpsSerial.read();
        gps.encode(c);
    }
}

void readGPSData(TinyGPSPlus &gps, SensorsData &sensorsData) {
    // Read data from GPS serial port
    while (gpsSerial.available() > 0) {
        char c = gpsSerial.read();
        gps.encode(c);
    }

    sensorsData.setGPS(
        gps.location.lat(),
        gps.location.lng(),
        gps.altitude.meters(),
        gps.speed.kmph(),
        gps.course.deg(),
        gps.satellites.value(),
        gps.date.year(),
        gps.date.month(),
        gps.date.day(),
        gps.time.hour(),
        gps.time.minute(),
        gps.time.second(),
        gps.location.isValid()
    );
}

void readGPSData(String &gps) {
    // Read data from GPS serial port
    int count = 0;
    while (gpsSerial.available() > 0) {
        char c = gpsSerial.read();
        gps += c;
        count++;
        if (count >= 64) {
            break;
        }
    }
}