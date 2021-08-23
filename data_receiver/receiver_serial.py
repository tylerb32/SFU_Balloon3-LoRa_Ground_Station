import serial
import os
import signal

# SERIAL_PORT = "COM3"
SERIAL_PORT = "/dev/ttyACM0"
SERIAL_BAUD_RATE = 9600
SERIAL_TIMEOUT = 10

receiving = True

def read_and_write(conn):
    # readline() blocks calling thread until line received
    # i.e: EOL character
    data_received = conn.readline()
    #if (data_received != 'b\'\''):
    # Extract data from line except for the first 2 and last 3 characters
    # i.e: "b'" and "\n'"
    data_clean = str(data_received)[2:-3]
    print("Received: " + str(data_received))
    print("Stored: " + data_clean)
    file_data = open(os.getcwd() + '/../web/data/data.txt', 'a')
    file_data.write(data_clean)
    file_data.write('\n')
    file_data.close()

def signal_handler(signum, frame):
    global receiving
    receiving = False

# TODO Implement occasional backups and store them off the server

if __name__ == '__main__':
    # Initialize serial port
    conn = serial.Serial(port=SERIAL_PORT, baudrate=SERIAL_BAUD_RATE, timeout=SERIAL_TIMEOUT)
    conn.flush()

    signal.signal(signal.SIGINT, signal_handler)

    while receiving:
        read_and_write(conn)