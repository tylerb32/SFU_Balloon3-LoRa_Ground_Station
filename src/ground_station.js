// Leaflet Map Creation
let map = L.map('map').setView([51.483667, -113.142667], 13); // Launch Site
//var map = L.map('map').setView([49.277693,-122.9209615], 11); // SFU Burnaby
L.tileLayer(tileDir + '/{z}/{x}/{y}.png', {
    // Setup map attributes
    minZoom: 13,
    maxZoom: 13
    // Credit OpenStreetMaps properly
}).addTo(map);

// Add launch sute marker
let launchSiteMarker = L.marker([51.483667, -113.142667]).addTo(map);
//var launchSiteMarker = L.marker([49.277693,-122.9209615]).addTo(map);
launchSiteMarker.bindPopup("<b>YO?</b>").openPopup();

//let marker1 = createMarker("Marker 1", [51.483667, -113.142667]);
//let marker2 = createMarker("Marker 2", [51.383667, -113.042667]);
// L.polyline([[51.483667, -113.142667], [51.383667, -113.042667]], {
//     color: 'blue',
//     smoothFactor: 2.0
// }).addTo(map);

// IDEA
// Based on GPS data project the landing zone
let landingZone = L.circle([51.583667, -113.242667], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 0.5,
    radius: 5000
}).addTo(map);
landingZone.bindTooltip("Projected Landing Zone").openTooltip();

// Create a marker containing location data and google maps directions link. Adds marker to map and returns the marker object
// TODO: Add parameter for colour
// TODO: Add time information
// TODO: Make google maps hyperlink open in new tab
function createMarker(title, location) {
    let getRoute = "Get Route";
    // How to format the maps query: https://developers.google.com/maps/documentation/urls/get-started
    let mapsQuery = "https://google.ca/maps/dir/?api=1&destination=" + location[0] + "," + location[1]
    let mapsLink = getRoute.link(mapsQuery);
    let marker = L.marker(location).addTo(map);
    marker.bindPopup("<b>"+ title + "</b><br>" + location[0] + ", " + location[1] + "</br><b>" + mapsLink + "</b>").openPopup();
    return marker;
}

// Get the string value of the specified setting
async function getSetting(setting) {
    let response = await fetch("/src/settings.json");
    let parsedObj = await response.json();
    return parsedObj[setting];
}