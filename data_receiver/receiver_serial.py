import serial
import os
import threading

#SERIAL_PORT = "COM3"
SERIAL_PORT = "/dev/ttyS3"
SERIAL_BAUD_RATE = 9600
SERIAL_TIMEOUT = .1

receiving = True
data_buffer = None

# Function will read until an EOL character is received
# Relies on lines being consistently terminated with EOL characters ("\n\r")
def read_until_EOL():
    return conn.readline()

def write_to_file(data):
    # Open data file in append mode
    file_data = open(os.getcwd() + '/../web/data/data.txt', 'a')
    file_data.write(str(data_buffer))
    file_data.write('\n')
    file_data.close()

def task_read(cond_var):
    while receiving:
        with cond_var:
            data_buffer.append(read_until_EOL())
            cond_var.notifyAll()

def task_write(cond_var):
    while receiving:
        with cond_var:
            cond_var.wait()
            write_to_file(data_buffer)

if __name__ == '__main__':
    # Initialize serial port
    conn = serial.Serial(port=SERIAL_PORT, baudrate=SERIAL_BAUD_RATE, timeout=SERIAL_TIMEOUT)

    cond_var = threading.Condition()
    thread_read = threading.Thread(target=task_read, args=(cond_var,))
    thread_write = threading.Thread(target=task_write, args=(cond_var,))

    thread_read.start()
    thread_write.start()
