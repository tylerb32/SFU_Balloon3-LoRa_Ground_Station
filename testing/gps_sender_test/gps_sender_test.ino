// Arduino I2C Library
#include <Wire.h>
#include <math.h>

#define RADIUS_MIN 1
#define RADIUS_MAX 5
#define RADIUS_PRECISION 1000
#define ANGLE_MIN 0
#define ANGLE_MAX 30
#define ANGLE_PRECISION 1

// I2C with Arduino as slave (writes data) and Raspberry Pi as master (reads data)
// Wiring: Raspi SDA (GPIO 3) -> Arduino A4
//		   Raspi SCL (GPIO 5) -> Arduino A5
// 		   Raspi GND (GPIO 6) -> Arduino GND

struct Location {
    float latitude;
    float longitude;
};

// Updates the center location with randomly generated GPS coordinates around a point
void generateLocation(float &radius, float &angle, struct Location *center) {
    // Update the radius variable with a random number between the defined min and max values
    // Note: Since "random" only works with integers, dividing by precision (multiple of 10) converts to desired float
    radius = random(RADIUS_MIN, RADIUS_MAX) / RADIUS_PRECISION;
    int sign = (random(0, 2) == 0) ? -1 : 1;
    // Add or subtract from the angle
    angle += sign * random(ANGLE_MIN, ANGLE_MAX) / ANGLE_PRECISION;
    // Calculate the cartesian coordinates to use for latitude and longitude
    center->latitude += radius * cos(angle);
    center->longitude += radius * sin(angle);
    // TODO: Implement method for keeping generated points within specified bounds
}

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
    // TODO: Use dtostrf to convert float to string
    float radius = 0;
    float angle = random(ANGLE_MIN, ANGLE_MAX) / ANGLE_PRECISION;
    // Initialize loc with center of tileset
    struct Location loc;
    loc.latitude = -122.7266425;
    loc.longitude = 49.21131;
    generateLocation(radius, angle, &loc);
    char lat[13];
    dtostrf(loc.latitude, 12, 7, *lat);
    char lon[13];
    dtostrf(loc.longitude, 12, 7, *lon);

    //Wire.write("Hello world"); // 11 byte message
    Wire.write(lat);
	// Note: need to send constant sized messages so the raspberry pi knows how large
	// each data block is
}
