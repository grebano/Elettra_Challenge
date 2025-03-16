# W5500 Ethernet Module Setup on WAVESHARE ESP32-S3

## Pin Configuration

| Pin Function | ESP32-S3 Pin |
| ------------ | ------------ |
| MISO         | 12           |
| MOSI         | 11           |
| SCLK         | 13           |
| CS           | 14           |
| INT          | 10           |
| RST          | 9            |

---

## Driver Configuration

- Chip Select (CS): Pin 14.
- Interrupt (INT): Pin 10.
- Reset (RST): Pin 9.
- PHY Address:
  - Default: Automatically detected.
  - Manually set using `driver.setPhyAddress(0)`.

---

## SPI Configuration

- SPI Pins:
  - MISO: Pin 12.
  - MOSI: Pin 11.
  - SCLK: Pin 13.
- SPI Frequency:
  - Default: 20 MHz.
  - Use `driver.setSpiFreq(10)` for 10 MHz.
- Custom SPI Instance:
  - Use setSPI to specify a custom SPIClass (e.g., HSPI).
    - `SPIClass SPI1(HSPI);` // Use HSPI interface
    - `SPI1.begin(13, 12, 11);` // SCLK = 13, MISO = 12, MOSI = 11

---

## MAC Address

- A fixed MAC address is defined in the code:
  - `byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xEF};` // W5500 Ethernet module

---

## Initialization Steps

1. Initialize SPI:

   - Set up SPI pins and frequency:
     - `SPIClass SPI1(HSPI);` // Use HSPI interface
     - `SPI1.begin(13, 12, 11);` // SCLK = 13, MISO = 12, MOSI = 11

2. Initialize Driver:

   - Configure CS, INT, and RST pins:
     - `W5500Driver driver(14, 10, 9);` // CS = 14, INT = 10, RST = 9

3. Link SPI to Driver:

   - Use setSPI to assign the SPI instance to the driver:
     - `driver.setSPI(SPI1);` // Use custom SPI instance

4. Initialize Ethernet:
   - Initialize the Ethernet stack:
     - `Ethernet.init(driver);`
   - Start the Ethernet connection:
     - `Ethernet.begin(mac);`

---

## Notes

- For dynamic MAC addresses, generating one based on the ESP32's unique chip ID.
