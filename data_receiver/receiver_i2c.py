from smbus import SMBus
from threading import Timer
import os.path

address = 0x8 # Bus address for i2c
bus = SMBus(1)

def main():

    def request_data(num_bytes):
        file_data = open(os.path.dirname(__file__) + '/../web/data/data.txt', 'a') # Open file in append mode
        block_data = bus.read_i2c_block_data(address, 0, num_bytes)
        file_data.write(str(block_data))
        file_data.write('\n')
        file_data.close()

    timer = IntervalTimer(1, request_data, 11)

class IntervalTimer:
    def __init__(self, interval, func, *args, **kwargs):
        self._timer = None
        self.interval = interval
        self.func = func
        self.args = args
        self.kwargs = kwargs
        self.running = False
        self.start()
    
    def _run(self):
        self.running = False
        self.start()
        self.func(*self.args, **self.kwargs)
    
    def start(self):
        if self.running == False:
            self._timer = Timer(self.interval, self._run)
            self._timer.start()
            self.running = True
    
    def stop(self):
        self._timer.cancel()
        self.running = False

if __name__ == '__main__':
    main()