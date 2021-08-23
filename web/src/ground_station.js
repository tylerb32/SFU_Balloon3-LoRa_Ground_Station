

//let jsonFile = await gsapi.readJSON('/tiles/tiles.json');
//console.log("JSON DATA: " + jsonFile.attribution);

// Declaring constants
const DATA_UPDATE_INTERVAL = 4.5* 1000; // Update data every 4 seconds
const CHECKSUM_SEP_CHAR = '~';
const PACKET_DELIM_CHAR = ',';
const NO_FIX_CHAR = '!';

let dataPointer = 0; // Stores current line in data file

let path = [[51.486, -113.142, 1000],
            [51.488, -113.157, 4766],
            [51.5113, -113.116, 7994],
            [51.5339, -113.046, 10684],
            [51.538, -112.965, 13912],
            [51.5409, -112.85, 20368],
            [51.534, -112.847, 24672],
            [51.5277, -112.877, 28707],
            [51.5537, -112.914, 24860.4],
            [51.5536, -112.834, 11223.5],
            [51.5965, -112.736, 3544],
            [51.5875, -112.736, -4.27632]];

let path2 = [[51.486, -113.142, 1000],
            [51.488 + (Math.random()/12), -113.157 + (Math.random()/12), 4766 + (Math.random()*50)],
            [51.5113 + (Math.random()/12), -113.116 + (Math.random()/12), 7994 + (Math.random()*50)],
            [51.5339 + (Math.random()/12), -113.046 + (Math.random()/12), 10684 + (Math.random()*50)],
            [51.538 + (Math.random()/12), -112.965 + (Math.random()/12), 13912 + (Math.random()*50)],
            [51.5409 + (Math.random()/12), -112.85 + (Math.random()/12), 20368 + (Math.random()*50)],
            [51.534 + (Math.random()/12), -112.847 + (Math.random()/12), 24672 + (Math.random()*50)],
            [51.5277 + (Math.random()/12), -112.877 + (Math.random()/12), 28707 + (Math.random()*50)],
            [51.5537 + (Math.random()/12), -112.914 + (Math.random()/12), 24860.4 + (Math.random()*50)],
            [51.5536 + (Math.random()/12), -112.834 + (Math.random()/12), 11223.5 + (Math.random()*50)],
            [51.5965 + (Math.random()/12), -112.736 + (Math.random()/12), 3544 + (Math.random()*50)],
            [51.5875 + (Math.random()/12), -112.736 + (Math.random()/12), -4.27632 + (Math.random()*50)]];

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
// let launchSiteMarker = L.marker([51.483667, -113.142667]).addTo(map);
// launchSiteMarker.bindPopup("<b>Launch Site</b>").openPopup();

// // Test markers
// // TODO: remove
// let marker1 = createMarker("Marker 1", [51.483667, -113.142667]);
// let marker2 = createMarker("Marker 2", [51.383667, -113.042667]);

let markers = [];
for (let i = 0; i < path.length; i++) {
    markers[i] = createMarker("Altitude " + path[i][2] + "m", [path[i][0], path[i][1]]);
    document.getElementById
}
for (let i = 1; i < path.length; i++) {
    let point1 = [path[i-1][0], path[i-1][1]];
    let point2 = [path[i][0], path[i][1]];
    L.polyline([point1, point2], {
        color: 'blue',
        smoothFactor: 2.0
    }).addTo(map);
}

for (let i = 1; i < path2.length; i++) {
    let point1 = [path2[i-1][0], path2[i-1][1]];
    let point2 = [path2[i][0], path2[i][1]];
    L.polyline([point1, point2], {
        color: 'black',
        smoothFactor: 2.0
    }).addTo(map);
}

// TODO: Create as markers are created, linking with the last marker to show the balloon's path
// L.polyline([[51.483667, -113.142667], [51.383667, -113.042667]], {
//     color: 'blue',
//     smoothFactor: 2.0
// }).addTo(map);

// IDEA
// Based on GPS data project the landing zone
// let landingZone = L.circle([51.583667, -113.242667], {
//     color: 'red',
//     fillColor: 'red',
//     fillOpacity: 0.5,
//     radius: 5000
// }).addTo(map);
//landingZone.bindTooltip("Projected Landing Zone").openTooltip();

// Create a marker containing location data and google maps directions link. Adds marker to map and returns the marker object
// TODO: Add parameter for colour
// TODO: Add time information
// TODO: Make google maps hyperlink open in new tab (currently redirects in current tab)
function createMarker(title, location) {
    let getRoute = "Get Route";
    // How to format the maps query: https://developers.google.com/maps/documentation/urls/get-started
    let mapsQuery = "https://google.ca/maps/dir/?api=1&destination=" + location[0] + "," + location[1]
    let mapsLink = getRoute.link(mapsQuery);
    let marker = L.marker(location).addTo(map);
    marker.bindPopup("<b>"+ title + "</b><br>" + location[0] + ", " + location[1] + "</br><b>" + mapsLink + "</b>").openPopup();
    return marker;
}

function getUserLocation() {
    if (navigator.geolocation()) {
        let latitude, longitude;
        navigator.geolocation.getCurrentPosition((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        });
        return [latitude, longitude];

    } else {
        return null;
    }
}

// Accept an array [lat,long]
function toDecimalDegrees(position) {
    // Latitude Format: DDMM.MMMM
    let latArr = position[0].split('.');
    let latDeg = parseInt(latArr[0].substring(0, 1));
    let latMin = parseInt(latArr[0].substring(2, 3) + latArr[1]);
    if (isNaN(latDeg) || isNaN(latMin)) {
        return null;
    }
    let latDD = latDeg + (latMin / 60);

    // Longitude Format: DDDMM.MMMM
    let lonArr = position[1].split('.');
    let lonDeg = parseInt(lonArr[0].substring(0, 2));
    let lonMin = parseInt(lonArr[0].substring(3, 4) + lonArr[1]);
    if (isNaN(lonDeg) || isNaN(lonMin)) {
        return null;
    }
    let lonDD = -1 * (lonDeg + (lonMin / 60));

    return [latDD, lonDD];
}

function parseData(packet) {
    let receivedChecksum = parseInt(packet.split(CHECKSUM_SEP_CHAR)[0]);
    // If the checksum can't be parsed to an int, the packet is considered corrupted
    if (isNaN(receivedChecksum)) {
        return null;
    }
    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < rawPacket.length; i++) {
        checksum += rawPacket[i];
    }
    if (receivedChecksum != checksum) {
        return null;
    }

    let data = rawPacket.split(PACKET_DELIM_CHAR);
    // Log/Error packet
    if (data.length == 1) {
        if (data[0] == NO_FIX_CHAR) {

        }
    // Data packet
    } else if (data.length == 4) {
        let coords = toDecimalDegrees([data[0], data[1]]);
        if (coords != null) {
            let dataDict = { 
                latitude: coords[0],
                longitude: coords[1],
                altitude: data[2],
                time: data[3] };
            return dataDict;
        } else {
            return null;
        }
        
    // Faulty packet
    } else {
        return null;
    }

}

// Update the data displayed on the map
function updateData() {
    // Request the data from the server
    fetch('/data/data.txt')
        .then(response => response.text())
        .then(data => {
            if (data.length > dataPointer) {
                let newFileData = data.substring(dataPointer, data.length);
                dataPointer += newFileData.length;
                let lineData = newFileData.split('\n');
                let sampled = false;
                for (let i = 0; i < lineData.length - 1; i++) {
                    console.log(lineData[i]);
                    if (sampled == false) {
                        sampled = true;


                    }
                }
            }
            /*
            let dataArr = data.split('\n'); // <- TODO: Look into the efficiency of doing this for very long files (operation occurs on interval)
            // If new data is in the text file, print all the new data
            if (dataArr.length > dataPointer) {
                for (; dataPointer < dataArr.length; dataPointer++) {
                    // Filter out unwanted artifacts
                    // TODO: add further parsing directly related to the balloon data being received (i.e: don't necessary want to display payload data)
                    if (dataArr[dataPointer] != "\n") {
                        // TODO: create markers using received data
                        console.log(dataArr[dataPointer]);
                    }
                }
            }*/
        });
}

// Update the data being displayed on the map
// TODO: defer param in setup
setInterval(updateData, DATA_UPDATE_INTERVAL);