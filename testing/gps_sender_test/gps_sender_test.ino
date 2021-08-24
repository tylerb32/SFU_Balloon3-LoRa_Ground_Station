#define SERIAL_BAUD_RATE 9600
#define SERIAL_TIMEOUT 1

// Note: Ensure the Arduino's serial port is updated correctly (port number and OS convention) in "receiver_serial.py"

void setup() {
    // Initialize serial connection
    Serial.begin(SERIAL_BAUD_RATE);
    Serial.setTimeout(SERIAL_TIMEOUT);
    Serial.flush();
}

String messageBuilder(String lat, String lon, String alt, String time) {
    String message;
    message += lat; message += ",";
    message += lon; message += ",";
    message += alt; message += ",";
    message += time;

    int checksum = 0;
    for (int i = 0; i < message.length(); i++) {
        checksum += message[i];
    }
    String packet;
    packet += String(packetNum); packet += "~";
    packetNum++;
    packet += message;
    return packet;
}

void loop() {
    float latitude = 5128.95954;
    float longitude = 11309.24024;
    String lat = String(latitude);
    String lon = String(longitude);

    // Write latitude to serial port
    // TODO: concatenate latitude and longitude
    Serial.print(messageBuilder(lat, lon, "1000", "5:00:00"));
    Serial.print("\n");
    delay(2000);
}

