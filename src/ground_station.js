
// Leaflet Map Creation
let map = L.map('map').setView([51.483667, -113.142667], 13); // Launch Site
//var map = L.map('map').setView([49.277693,-122.9209615], 11); // SFU Burnaby
L.tileLayer('/tiles/{z}/{x}/{y}.png', {
    // Setup map attributes
    minZoom: 13,
    maxZoom: 13
    // Credit OpenStreetMaps properly
}).addTo(map);

// Add launch sute marker
let launchSiteMarker = L.marker([51.483667, -113.142667]).addTo(map);
//var launchSiteMarker = L.marker([49.277693,-122.9209615]).addTo(map);
launchSiteMarker.bindPopup("<b>YO?</b>").openPopup();

// IDEA
// Based on GPS data project the landing zone
let landingZone = L.circle([51.583667, -113.242667], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 0.5,
    radius: 5000
}).addTo(map);
landingZone.bindTooltip("Projected Landing Zone").openTooltip();

// Old code for using mbtiles library for leaflet (not needed unless switching tileset)
//    L.tileLayer.mbTiles('Addon-NA11-J60.mbtiles', {
//        minZoom: 11,
//        maxZoom: 15
//    }).addTo(map); // TODO: Try using mbutils to export pbf instead of png
