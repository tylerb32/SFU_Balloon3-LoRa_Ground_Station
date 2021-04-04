#include <Wire.h>

void setup() {
    // Join i2c on address 8
    Wire.begin(8);
    // Register event
    Wire.onRequest(requestEvent);
}

void loop() {
    delay(100);
}

// This function will execute whenever the master requests data over i2c
void requestEvent() {
    Wire.write("Hello world"); // 11 byte message
}
