// setup map

// modify map settings

// add marker at location

// remove marker?

// fetch data

export async function readJSON(path) {
    let response = await fetch(path);
    let json = await response.json();
    return json;
}

export async function readText(path) {
    let response = await fetch(path);
    let text = await response.text();
    return text;
}

export function getUserLocation() {
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

// Get google maps query link
export function getDirectionsURL(location) {
    return "https://google.ca/maps/dir/?api=1&destination=" + location[0] + "," + location[1];
}

// Wrapper for Leaflet's map object
export class Map {
    constructor(location, tiles_path, minZoom, maxZoom) {
        this.latitude = location[0];
        this.longitude = location[1];
        this.tiles_path = tiles_path;
        
        // Create Leaflet map object and set attributes
        this.map = L.map('map').setView([this.latitude, this.longitude], maxZoom);
        L.tileLayer(this.tiles_path + '/{z}/{x}/{y}.png', {
            minZoom: minZoom,
            maxZoom: maxZoom,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add scale overlay to map
        L.control.scale().addTo(this.map);
        
        this.markers = [];
    }

    // Adds a marker to the map at a specified location and title
    addMarker(location, title) {
        let marker = L.marker(location);
        marker.bindPopup(title.bold());
        if (!this.markers.includes(marker)) {
            this.markers.push(marker);
            marker.addTo(this.map);
        }
    }

    // Removes a marker from the map specified by its location
    removeMarker(location) {
        for (let i = 0; i < this.markers.length; i++) {
            if (L.latLng(location[0], location[1]).equals(this.markers[i].getLatLng())) {
                this.markers[i].remove(this.map);
                this.markers.pop(this.markers[i]);
                break;
            }
        }
    }
}