const fs = require('fs');
const eol = require('os').EOL;
//const gs = require('./ground_station_API');
let L = require('leaflet')

let map = L.map('map').setView([51.483667, -113.142667], 14); // Launch Site
L.tileLayer('http://127.0.0.1:8080/tiles_ab/{z}/{x}/{y}.png', {
    // Setup map attributes
    minZoom: 9,
    maxZoom: 15,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// Add map scale
L.control.scale().addTo(map);

// Add launch site marker
let launchSiteMarker = L.marker([51.483667, -113.142667]).addTo(map);
launchSiteMarker.bindPopup("<b>Launch Site</b>").openPopup();


// let map = new gs.Map([51.483667, -113.142667], '/tiles_ab', 9, 14);
// map.addMarker([51.483667, -113.142667], "MARKER 1".bold());

// const filePath = '../data/data.txt';
// let fileSize = fs.statSync(filePath).size;
// // fs.watch(filePath, function(event, trigger) {
// fs.watchFile(filePath, function (current, previous) {
//     //if (trigger) {
//     if (current.mtime <= previous.mtime) {
//         return;
//     }
    
//     let newFileSize = fs.statSync(filePath).size;
//     let sizeDiff = newFileSize - fileSize;

//     if (sizeDiff < 0) {
//         fileSize = 0;
//         sizeDiff = newFileSize;
//     }

//     let buffer = new Buffer.alloc(sizeDiff);
//     let fileDes = fs.openSync(filePath, 'r');
//     fs.readSync(fileDes, buffer, 0, sizeDiff, fileSize);
//     fs.closeSync(fileDes);

//     fileSize = newFileSize;
//     parseBuffer(buffer);
//     //}
// });

// function parseBuffer(buffer) {
//     buffer.toString().split(eol).forEach(function (line) {
//         if (line != "") {
//             console.log(line);
//         }
//     });
// }