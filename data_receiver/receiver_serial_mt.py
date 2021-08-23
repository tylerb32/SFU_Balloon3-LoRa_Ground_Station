import serial
import os
import threading
import signal

#SERIAL_PORT = "COM3"
SERIAL_PORT = "/dev/ttyACM0"
SERIAL_BAUD_RATE = 9600
SERIAL_TIMEOUT = .1

receiving = True
data_buffer = ""

# Reads from serial line until an EOL character is received
# Relies on lines being consistently terminated with EOL characters ("\n\r")
def read_until_EOL():
    return conn.readline()

# Writes the passed data to the web-hosted "data.txt" file
# File is opened/closed each write to ensure data storage is not interrupted
def write_to_file(data):
    # Open data file in append mode
    file_data = open(os.getcwd() + '/../web/data/data.txt', 'a')
    file_data.write(str(data_buffer))
    file_data.write('\n')
    file_data.close()

# Function waits for a line to be received over serial then writes the received data to file
# Busy-wait approach
def write_and_read():
    data_received = conn.readline()
    print("Received: " + str(data_received))
    # Open data file in append mode
    file_data = open(os.getcwd() + '/../web/data/data.txt', 'a')
    file_data.write(str(data_received))
    file_data.write('\n')
    file_data.close()

# Reads the data as it is received over the serial line and adds it to the data buffer
# Notifies write thread when read completes
def task_read(cond_var):
    global data_buffer
    while receiving:
        with cond_var:
            data_buffer = read_until_EOL()
            cond_var.notifyAll()

# Writes data to file
# Waits for notification from task_read
def task_write(cond_var):
    while receiving:
        with cond_var:
            cond_var.wait()
            write_to_file(data_buffer)

# Calls when keyboard interrupt fires (i.e ^C)
# Used to safely stop the read and write threads
def signal_handler(signum, frame):
    global receiving
    receiving = False

if __name__ == '__main__':
    # Initialize serial port
    conn = serial.Serial(port=SERIAL_PORT, baudrate=SERIAL_BAUD_RATE, timeout=SERIAL_TIMEOUT)

    # while True:
    #     write_and_read()

    # Register SIGINT signal handler
    # NOTE: Only works on Linux currently
    # TODO: Find which signal can be initialized via the startup script to stop the program safely
    signal.signal(signal.SIGINT, signal_handler)

    cond_var = threading.Condition()
    thread_read = threading.Thread(target=task_read, args=(cond_var,))
    thread_write = threading.Thread(target=task_write, args=(cond_var,))

    thread_read.start()
    thread_write.start()