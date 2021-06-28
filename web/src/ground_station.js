import * as gsapi from "./ground_station_API.js"

let map = new gsapi.Map([51.483667, -113.142667], '/tiles', 9, 15);
map.addMarker([51.483667, -113.142667], "MARKER 1".bold());
