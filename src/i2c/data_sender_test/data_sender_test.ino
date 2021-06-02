// Arduino I2C Library
#include <Wire.h>

// I2C with Arduino as slave (writes data) and Raspberry Pi as master (reads data)
// Wiring: Raspi SDA (GPIO 3) -> Arduino A4
//		   Raspi SCL (GPIO 5) -> Arduino A5
// 		   Raspi GND (GPIO 6) -> Arduino GND

void setup() {
    // Join i2c on address 8
    Wire.begin(8);
    // Register event
    Wire.onRequest(requestEvent);
}

void loop() {
	// Slows clock so not too many messages are sent (only here for testing
	// on actual ground station we will send data as it is received by the LoRa module)
    delay(1000);
}

// This function will execute whenever the master requests data over i2c
void requestEvent() {
    Wire.write("Hello world"); // 11 byte message
	// Note: need to send constant sized messages so the raspberry pi knows how large
	// each data block is
}
