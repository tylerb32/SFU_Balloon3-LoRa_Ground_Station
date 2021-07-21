#include <math.h>

#define SERIAL_BAUD_RATE 9600
#define SERIAL_TIMOUT 1

#define RADIUS_MIN 1
#define RADIUS_MAX 5
#define RADIUS_PRECISION 100
#define ANGLE_MIN 0
#define ANGLE_MAX 30
#define ANGLE_PRECISION 1

// Note: Ensure the Arduino's serial port is updated correctly (port number and OS convention) in "receiver_serial.py"

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
    // Initialize serial connection
    Serial.begin(SERIAL_BAUD_RATE);
    Serial.setTimeout(SERIAL_TIMEOUT);
}

void loop() {
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

    // Write latitude to serial port
    // TODO: concatenate latitude and longitude
    Serial.print(lat);
}
