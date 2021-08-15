import * as gsapi from "./ground_station_API.js"

const DATA_UPDATE_INTERVAL = 5 * 1000;

let map = new gsapi.Map([51.483667, -113.142667], '/tiles_ab', 9, 14);
map.addMarker([51.483667, -113.142667], "MARKER 1".bold());

// Function accepts the packet received over serial and trims formatting characters/returns individual data components in a dictionary
// TODO: Detect errors and return a flag detailing faulty packages
function parsePacket(packet) {
    let components = {};
    // Since packets over serial are received as "b'<data>'", extract the data between the apostrophes
    // Note: Currently does not account for corrupt/dropped "'" characters
    let packetData = packet.substring(packet.lastIndexOf("'", 3) + 1, packet.lastIndexOf("'"));
    // Assuming ',' delimiter
	dataArr = packet.split(",");

	return components;
}

// TODO: Implement within API
// TODO: Rework this function to utilize streams/nodejs due to inefficiency with large datasets
let dataPointer = 0;
async function updateData() {
    let data = await gsapi.readText("/data/data.txt");
    let dataArr = data.split('\n');
    // Loop through the new lines of data.txt
    if (dataArr.length > dataPointer) {
        for (; dataPointer < dataArr.length; dataPointer++) {
            if (dataArr[dataPointer] != "\n") {
                console.log("Received: " + dataArr[dataPointer]);
            }
        }
    }
}

setInterval(updateData, DATA_UPDATE_INTERVAL);
