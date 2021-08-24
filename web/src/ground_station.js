import * as utils from './ground_station_utils.js'

// Declaring constants
const DATA_UPDATE_INTERVAL = 5 * 1000; // Update data every 5 seconds
const CHECKSUM_SEP_CHAR = '~';
const PACKET_DELIM_CHAR = ',';
const NO_FIX_CHAR = '!';
const PROJECTED_FLIGHT_FILE_PATH = '/data/flight_path.csv';
const PACKET_ERROR = { INVALID_CHECKSUM: 1, INVALID_CHARACTERS: 2, INVALID_FORMAT: 3, NO_FIX: 4 };

let dataPointer = 0; // Stores current line in data file

// Leaflet Map Creation
let map = L.map('map').setView([51.483667, -113.142667], 14); // Launch Site
L.tileLayer('/tiles_ab/{z}/{x}/{y}.png', {
    // Setup map attributes
    minZoom: 9,
    maxZoom: 15,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// Add map scale
L.control.scale().addTo(map);

// // Add launch site marker
let launchSiteMarker = L.marker([51.486, -113.142], {icon: utils.ICON_HOUSE}).addTo(map);
launchSiteMarker.bindPopup("<b>Launch Site</b>").openPopup();

// Create a marker containing location data and google maps directions link. Adds marker to map and returns the marker object
function createLocMarker(location, altitude, time, title, icon) {
    let getRoute = "Get Route";
    // How to format the maps query: https://developers.google.com/maps/documentation/urls/get-started
    let mapsQuery = "https://google.ca/maps/dir/?api=1&destination=" + location[0] + "," + location[1]
    let mapsLink = getRoute.link(mapsQuery);
    let marker;
    if (icon == null) {
        marker = L.marker(location).addTo(map);
    } else {
        marker = L.marker(location, {icon: icon}).addTo(map);
    }
    marker.bindPopup("<p><b>"+ title + "</b><br>"
                     + "Time: " + time + "<br>"
                     + location[0] + ", " + location[1] + "<br>"
                     + "Altitude: " + altitude + "m" + "<br><b>"
                     + mapsLink + "</b></p>");
    return marker;
}

// Accept an array [lat,long]
function toDecimalDegrees(position) {
    // Latitude Format: DDMM.MMMM
    let latArr = position[0].split('.');
    let latDeg = parseInt(latArr[0].substring(0, 2));
    let latMin = parseFloat(latArr[0].substring(2, latArr[0].length) + '.' + latArr[1]);
    
    if (isNaN(latDeg) || isNaN(latMin)) {
        return null;
    }
    let latDD = latDeg + (latMin / 60);

    // Longitude Format: DDDMM.MMMM
    let lonArr = position[1].split('.');
    let lonDeg = parseInt(lonArr[0].substring(0, 3));
    let lonMin = parseFloat(lonArr[0].substring(3, lonArr[0].length) + '.' + lonArr[1]);

    if (isNaN(lonDeg) || isNaN(lonMin)) {
        return null;
    }
    let lonDD = -1 * (lonDeg + (lonMin / 60));

    return [latDD, lonDD];
}

function parseData(packet) {
    let splitPacket = packet.split(CHECKSUM_SEP_CHAR);
    let receivedChecksum = parseInt(splitPacket[0]);
    let rawPacket = splitPacket[1];
    // If the checksum can't be parsed to an int, the packet is considered corrupted
    if (isNaN(receivedChecksum)) {
        return PACKET_ERROR.INVALID_CHARACTERS;
    }
    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < rawPacket.length; i++) {
        checksum += rawPacket.charCodeAt(i);
    }
    console.log("Received: " + receivedChecksum + " | checksum: " + checksum);
    if (receivedChecksum != checksum) {
        return PACKET_ERROR.INVALID_CHECKSUM;
    }

    let data = rawPacket.split(PACKET_DELIM_CHAR);
    // Log/Error packet
    if (data.length == 1) {
        if (data[0] == NO_FIX_CHAR) {
            return PACKET_ERROR.NO_FIX;
        } else {
            return PACKET_ERROR.INVALID_CHARACTERS;
        }
    // Data packet
    } else if (data.length == 4) {
        let coords = toDecimalDegrees([data[0], data[1]]);
        if (coords != null) {
            let dataDict = { 
                latitude: coords[0],
                longitude: coords[1],
                altitude: data[2],
                time: data[3]
            };
            return dataDict;
        } else {
            return PACKET_ERROR.INVALID_CHARACTERS;
        }
        
    // Faulty packet
    } else {
        return PACKET_ERROR.INVALID_FORMAT;
    }
}

function plotProjectedPath() {
    // Request the file from the server
    fetch(PROJECTED_FLIGHT_FILE_PATH)
        .then(response => response.text())
        .then(data => {
            let path = [];
            let allData = data.split('\n');
            for (let i = 0; i < allData.length; i+=5) {
                let line = allData[i].split(',');
                // Parse Time
                let unixTime = parseInt(line[0]);
                let date = new Date(unixTime * 1000);
                let hours = date.getHours();
                let minutes = '0' + date.getMinutes();
                let seconds = '0' + date.getSeconds();
                let time = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                //Parse latitude, longitude, and altitude
                let latitude = parseFloat(line[1]);
                let longitude = parseFloat(line[2]);
                let altitude = parseFloat(line[3]);
                path.push({
                    latitude: latitude,
                    longitude: longitude,
                    altitude: altitude,
                    time: time
                });
            }
            let markers = [];
            for (let i = 0; i < path.length; i++) {
                markers[i] = createLocMarker([path[i].latitude, path[i].longitude], path[i].altitude, path[i].time, "Predicted " + i, utils.ICON_CIRCLE_BLACK);
            }
            for (let i = 1; i < path.length; i++) {
                let point1 = [path[i-1].latitude, path[i-1].longitude];
                let point2 = [path[i].latitude, path[i].longitude];
                L.polyline([point1, point2], {
                    color: 'black',
                    smoothFactor: 2.0
                }).addTo(map);
            }
        });
}
plotProjectedPath();

// Update the data displayed on the map
async function updateData() {
    // Request the data from the server
    let response = await fetch('/data/data.txt');
    let data = await response.text();
    if (data.length > dataPointer) {
        let newFileData = data.substring(dataPointer, data.length);
        dataPointer += newFileData.length;
        let lineData = newFileData.split('\n');

        for (let i = 0; i < lineData.length - 1; i++) {
            let packet = parseData(lineData[i]);
            if (packet == PACKET_ERROR.INVALID_CHARACTERS) {
                console.warn("Invalid character received.");

            } else if (packet == PACKET_ERROR.INVALID_CHECKSUM) {
                console.warn("Invalid checksum received.");

            } else if (packet == PACKET_ERROR.INVALID_FORMAT) {
                console.warn("Invalid format received.");

            } else if (packet == PACKET_ERROR.NO_FIX) {
                console.error("No GPS fix.");
            } else {
                createLocMarker([packet.latitude, packet.longitude], packet.altitude, packet.time, "Received", utils.ICON_LOC_BLUE);
            }
        }
    }
}

// Update the data being displayed on the map
// TODO: defer param in setup
setInterval(updateData, DATA_UPDATE_INTERVAL);