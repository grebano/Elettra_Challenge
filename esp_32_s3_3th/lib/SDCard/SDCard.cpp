/*
 * pin 1 - not used          |  Micro SD card     |
 * pin 2 - CS (SS)           |                   /
 * pin 3 - DI (MOSI)         |                  |__
 * pin 4 - VDD (3.3V)        |                    |
 * pin 5 - SCK (SCLK)        | 8 7 6 5 4 3 2 1   /
 * pin 6 - VSS (GND)         | ▄ ▄ ▄ ▄ ▄ ▄ ▄ ▄  /
 * pin 7 - DO (MISO)         | ▀ ▀ █ ▀ █ ▀ ▀ ▀ |
 * pin 8 - not used          |_________________|
 *                             ║ ║ ║ ║ ║ ║ ║ ║
 *                     ╔═══════╝ ║ ║ ║ ║ ║ ║ ╚═════════╗
 *                     ║         ║ ║ ║ ║ ║ ╚══════╗    ║
 *                     ║   ╔═════╝ ║ ║ ║ ╚═════╗  ║    ║
 * Connections for     ║   ║   ╔═══╩═║═║═══╗   ║  ║    ║
 * full-sized          ║   ║   ║   ╔═╝ ║   ║   ║  ║    ║
 * SD card             ║   ║   ║   ║   ║   ║   ║  ║    ║
 * Pin name         |  -  DO  VSS SCK VDD VSS DI CS    -  |
 * SD pin number    |  8   7   6   5   4   3   2   1   9 /
 *                  |                                  █/
 *                  |__▍___▊___█___█___█___█___█___█___/
 *
 */

#include "SDCard.h"

 
 void listDir(fs::FS &fs, const char *dirname, uint8_t levels) {
   Serial.printf("Listing directory: %s\n", dirname);
 
   File root = fs.open(dirname);
   if (!root) {
     Serial.println("Failed to open directory");
     return;
   }
   if (!root.isDirectory()) {
     Serial.println("Not a directory");
     return;
   }
 
   File file = root.openNextFile();
   while (file) {
     if (file.isDirectory()) {
       Serial.print("  DIR : ");
       Serial.println(file.name());
       if (levels) {
         listDir(fs, file.path(), levels - 1);
       }
     } else {
       Serial.print("  FILE: ");
       Serial.print(file.name());
       Serial.print("  SIZE: ");
       Serial.println(file.size());
     }
     file = root.openNextFile();
   }
 }
 
 void createDir(fs::FS &fs, const char *path) {
   Serial.printf("Creating Dir: %s\n", path);
   if (fs.mkdir(path)) {
     Serial.println("Dir created");
   } else {
     Serial.println("mkdir failed");
   }
 }
 
 void removeDir(fs::FS &fs, const char *path) {
   Serial.printf("Removing Dir: %s\n", path);
   if (fs.rmdir(path)) {
     Serial.println("Dir removed");
   } else {
     Serial.println("rmdir failed");
   }
 }
 
 void readFile(fs::FS &fs, const char *path) {
   Serial.printf("Reading file: %s\n", path);
 
   File file = fs.open(path);
   if (!file) {
     Serial.println("Failed to open file for reading");
     return;
   }
 
   Serial.print("Read from file: ");
   while (file.available()) {
     Serial.write(file.read());
   }
   file.close();
 }
 
 void writeFile(fs::FS &fs, const char *path, const char *message) {
   Serial.printf("Writing file: %s\n", path);
 
   File file = fs.open(path, FILE_WRITE);
   if (!file) {
     Serial.println("Failed to open file for writing");
     return;
   }
   if (file.print(message)) {
     Serial.println("File written");
   } else {
     Serial.println("Write failed");
   }
   file.close();
 }
 
 void appendFile(fs::FS &fs, const char *path, const char *message) {
   Serial.printf("Appending to file: %s\n", path);
 
   File file = fs.open(path, FILE_APPEND);
   if (!file) {
     Serial.println("Failed to open file for appending");
     return;
   }
   if (file.print(message)) {
     Serial.println("Message appended");
   } else {
     Serial.println("Append failed");
   }
   file.close();
 }
 
 void renameFile(fs::FS &fs, const char *path1, const char *path2) {
   Serial.printf("Renaming file %s to %s\n", path1, path2);
   if (fs.rename(path1, path2)) {
     Serial.println("File renamed");
   } else {
     Serial.println("Rename failed");
   }
 }
 
 void deleteFile(fs::FS &fs, const char *path) {
   Serial.printf("Deleting file: %s\n", path);
   if (fs.remove(path)) {
     Serial.println("File deleted");
   } else {
     Serial.println("Delete failed");
   }
 }
 
 void testFileIO(fs::FS &fs, const char *path) {
   File file = fs.open(path);
   static uint8_t buf[512];
   size_t len = 0;
   uint32_t start = millis();
   uint32_t end = start;
   if (file) {
     len = file.size();
     size_t flen = len;
     start = millis();
     while (len) {
       size_t toRead = len;
       if (toRead > 512) {
         toRead = 512;
       }
       file.read(buf, toRead);
       len -= toRead;
     }
     end = millis() - start;
     Serial.printf("%u bytes read for %lu ms\n", flen, end);
     file.close();
   } else {
     Serial.println("Failed to open file for reading");
   }
 
   file = fs.open(path, FILE_WRITE);
   if (!file) {
     Serial.println("Failed to open file for writing");
     return;
   }
 
   size_t i;
   start = millis();
   for (i = 0; i < 2048; i++) {
     file.write(buf, 512);
   }
   end = millis() - start;
   Serial.printf("%u bytes written for %lu ms\n", 2048 * 512, end);
   file.close();
 }
 
 void deleteAllFiles(fs::FS &fs, const char *path) {
   File root = fs.open(path);
   if (!root) {
     Serial.println("Failed to open directory");
     return;
   }
   if (!root.isDirectory()) {
     Serial.println("Not a directory");
     return;
   }
 
   File file = root.openNextFile();
   while (file) {
     if (file.isDirectory()) {
       deleteAllFiles(fs, file.path());
     } else {
       Serial.print("Deleting file: ");
       Serial.println(file.path());
       fs.remove(file.path());
     }
     file = root.openNextFile();
   }
 }

void rotateLogFile(fs::FS &fs, const char *path, size_t maxSize, int maxBackups) {
  File file = fs.open(path);
  if (file && file.size() > maxSize) {
    file.close();
    
    // Delete oldest backup if it exists
    String oldestBackup = String(path) + "." + String(maxBackups);
    if (fs.exists(oldestBackup.c_str())) {
      fs.remove(oldestBackup.c_str());
    }
    
    // Shift existing backups
    for (int i = maxBackups - 1; i >= 1; i--) {
      String oldName = String(path) + "." + String(i);
      String newName = String(path) + "." + String(i + 1);
      if (fs.exists(oldName.c_str())) {
        renameFile(fs, oldName.c_str(), newName.c_str());
      }
    }
    
    // Rename current file to .1
    String backup = String(path) + ".1";
    renameFile(fs, path, backup.c_str());
    
    // Create new empty file
    writeFile(fs, path, "");
  }
}

