# SFU Aerospace Balloon 3 - LoRa Ground Station
Balloon 3 is SFU Aerospace's 3rd iteration of the high-altitude balloon project which is intended to further students understanding of the engineering process while preparing them for contributing to future design teams such as rocketry, astrorobotics, and satellites. This is my implementation of our ground station which integrated with an Arduino board containing the 915MHz LoRa radio module over serial to store, parse, backup, and display the received data.

## Project Links
[Balloon 3 Team Project Write Up](https://www.sfusat.org/balloon-3), [Balloon Flight Path](https://tylerb32.github.io/)

## Telemetry Display
The ground station loads a [predicted flight path](https://predict.habhub.org/) from a csv file and displays it in black. Additionally, as telemetry is received and passed to the web-app from the serial receiver, markers are plotted based on a defined minimum separated factor which green indicating a gain in altitude and red a decrease in altitude. The detailed path of the balloon is plotted in blue. Clicking on any marker displays longitude, latitude, and altitude corresponding to the time the data point was collected from the balloon. A hyperlink also directs the user to a google maps page displaying driving directions to the specified location given that the user has internet access (which is unlikely if you are tracking a balloon in the middle of knowhere).
![Path chunk](https://github.com/tylerb32/Repo_Images/blob/main/ground_station_map_1.png)

As telemetry is received by the web-app, each packet is parsed and evaluated for validity. A make-shift console displays the received packets and displays the detected errors (supports invalid checksum, invalid character, invalid format, and no GPS fix).
![Console](https://github.com/tylerb32/Repo_Images/blob/main/ground_station_map_2.png)

## High-Level Architecture
The ground station consists of an Arduino for receiving packets via LoRa 915MHz radio module and a laptop to receive the telemetry over serial. A python script (serial_receiver.py) will poll the serial line and append each packet to data.txt. The receiver script also backs up the data file on a defined interval.

The web-app will fetch the data file on a defined interval and maintain a pointer to the end of the file. The data is then parsed, validated, and plotted on the Leaflet map.

### Dependencies
- Python3
- LeafetJS
- SQL
- http-server
- Map tiles (this project used [Open Street Map](https://www.openstreetmap.org/#map=3/71.34/-96.82) and [Maperitive](http://maperitive.net/) for rastering/exporting the OSM 
data)
Note: The project was intended for Linux use only but with small tweaks to the serial receiver could function in Windows.

![Architecture](https://github.com/tylerb32/Repo_Images/blob/main/ground_station_diag_1.png)

## Post-Launch Reflection
Although the recovery of the balloon was successful and the ground station did it's job, some shortcomings were evident while tracking the balloon.
- Knowing the balloon's velocity and falling speed would be nice as it helps with chasing the balloon and predicting the balloon's landing location if the GPS signal is lost while falling. This feature was protoyped but was ultimately scrapped due to time constraints surrounding validation.
- Displaying the user's location would be beneficial for tracking the balloon without the need for an external map. This would require either an internet connection (for an approximate location) or a web-server allowing mobile devices to view the ground station.
- Scaling related to how many plot points are displayed would be nice to have, although a luxury.
