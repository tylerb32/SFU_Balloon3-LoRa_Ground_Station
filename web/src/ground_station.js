import * as gsapi from "./ground_station_API.js"

let map = new gsapi.Map([51.483667, -113.142667], '/tiles_ab', 9, 14);
map.addMarker([51.483667, -113.142667], "MARKER 1".bold());

