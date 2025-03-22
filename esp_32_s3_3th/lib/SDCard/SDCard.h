#ifndef SDCARD_H
#define SDCARD_H

#include "FS.h"
#include "SD.h"
#include "SPI.h"

/**
 * List directory contents with specified depth
 * @param fs Filesystem to use
 * @param dirname Directory to list
 * @param levels Depth of subdirectories to display
 */
void listDir(fs::FS &fs, const char *dirname, uint8_t levels);

/**
 * Create a directory
 * @param fs Filesystem to use
 * @param path Path of the directory to create
 */
void createDir(fs::FS &fs, const char *path);

/**
 * Remove a directory
 * @param fs Filesystem to use
 * @param path Path of the directory to remove
 */
void removeDir(fs::FS &fs, const char *path);

/**
 * Read a file and print its contents to Serial
 * @param fs Filesystem to use
 * @param path Path to the file
 */
void readFile(fs::FS &fs, const char *path);

/**
 * Write data to a file (creates or overwrites)
 * @param fs Filesystem to use
 * @param path Path to the file
 * @param message Data to write
 */
void writeFile(fs::FS &fs, const char *path, const char *message);

/**
 * Append data to an existing file
 * @param fs Filesystem to use
 * @param path Path to the file
 * @param message Data to append
 */
void appendFile(fs::FS &fs, const char *path, const char *message);

/**
 * Rename a file
 * @param fs Filesystem to use
 * @param path1 Original path/name
 * @param path2 New path/name
 */
void renameFile(fs::FS &fs, const char *path1, const char *path2);

/**
 * Delete a file
 * @param fs Filesystem to use
 * @param path Path to the file
 */
void deleteFile(fs::FS &fs, const char *path);

/**
 * Test file I/O performance
 * @param fs Filesystem to use
 * @param path Path to test file
 */
void testFileIO(fs::FS &fs, const char *path);

/**
 * Initialize the SD card
 * @return true if initialization was successful
 */
bool initSDCard();

/**
 * Save data to SD card 
 * @param data Data to be saved
 * @return true if successful
 */
bool saveDataToSDCard(const char* data);

/**
 * Delete all files in the specified directory
 * @param fs Filesystem to use
 * @param path Path to the directory
 */
void deleteAllFiles(fs::FS &fs, const char *path);

#endif // SDCARD_H