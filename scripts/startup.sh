#! /bin/sh
cd ../python
python3 data_receiver.py &
cd ../web
http-server
