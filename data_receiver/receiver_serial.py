import serial
import os
import signal
from shutil import SameFileError, copyfile
from datetime import datetime
import time

# SERIAL_PORT = "COM3"
SERIAL_PORT = "/dev/ttyACM0"
SERIAL_BAUD_RATE = 9600
SERIAL_TIMEOUT = 10
BACKUP_INTERVAL = 15 * 60 # Backup every 15 minutes

receiving = True

current_time = time.time()

def backup_file():
    now = datetime.now()
    date_str = now.strftime("%b-%d-%Y_%H-%M-%S")
    file_name = "data_" + date_str + ".txt"
    try:
        copyfile("../web/data/data.txt", "../backups/" + file_name)
        print("Backup created successfully")
    except:
        print("ERROR: Unable to backup file.");

def read_and_write(conn):
    global current_time
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

    if (time.time() - current_time > BACKUP_INTERVAL):
        current_time = time.time()
        backup_file()


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