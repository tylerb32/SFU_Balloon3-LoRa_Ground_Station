from smbus2 import SMBus
from threading import Timer

address = 0x8 # Bus address for i2c
bus = SMBus(1)
# Open file in append mode
file_data = open('data_test.txt', 'a')

def request_data(num_bytes):
    block_data = bus.read_i2c_block_data(address, 0, num_bytes)
    file_data.write(block_data)
    file_data_write('\n')

timer = IntervalTimer(5, request_data, 11)
try:
    #parsing data here?
finally:
    timer.stop()
    file_data.close()

class IntervalTimer:
    def __init__(self, interval, func, *args, **kwargs):
        self._timer = None
        self.interval = interval
        self.func = func
        self.args = args
        self.kwargs = kwargs
        self.running = false
        self.start()
    
    def _run(self):
        self.running = false
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