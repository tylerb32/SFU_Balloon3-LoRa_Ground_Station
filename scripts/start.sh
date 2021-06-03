#! /bin/sh
cd ../data_receiver
python3 receiver.py &
cd ../web
http-server
