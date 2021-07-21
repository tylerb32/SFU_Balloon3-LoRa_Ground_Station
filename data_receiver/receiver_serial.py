import serial
import os
import threading

#SERIAL_PORT = "COM3"
SERIAL_PORT = "/dev/ttyACM0"
SERIAL_BAUD_RATE = 9600
SERIAL_TIMEOUT = .1

receiving = True
data_buffer = ""

# Function will read until an EOL character is received
# Relies on lines being consistently terminated with EOL characters ("\n\r")
def read_until_EOL():
    return conn.readline()

# Function writes the passed data to the web-hosted "data.txt" file
# File is opened/closed each write to ensure data storage is not interrupted
def write_to_file(data):
    # Open data file in append mode
    file_data = open(os.getcwd() + '/../web/data/data.txt', 'a')
    file_data.write(str(data_buffer))
    file_data.write('\n')
    file_data.close()

def write_and_read():
    data_received = conn.readline()
    print("Received: " + str(data_received))
    # Open data file in append mode
    file_data = open(os.getcwd() + '/../web/data/data.txt', 'a')
    file_data.write(str(data_received))
    file_data.write('\n')
    file_data.close()

# Function reads the data as it is received over the serial line and adds it to the data buffer
def task_read(cond_var):
    while receiving:
        with cond_var:
            data_buffer = read_until_EOL()
            cond_var.notifyAll()

def task_write(cond_var):
    while receiving:
        with cond_var:
            cond_var.wait()
            write_to_file(data_buffer)

if __name__ == '__main__':
    # Initialize serial port
    conn = serial.Serial(port=SERIAL_PORT, baudrate=SERIAL_BAUD_RATE, timeout=SERIAL_TIMEOUT)

    while True:
        write_and_read()

    # cond_var = threading.Condition()
    # thread_read = threading.Thread(target=task_read, args=(cond_var,))
    # thread_write = threading.Thread(target=task_write, args=(cond_var,))

    # thread_read.start()
    # thread_write.start()

    # TODO: Implement safe close method
