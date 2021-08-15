const fs = require('fs');
const eol = require('os').EOL;

const filePath = '../data/data.txt';
let fileSize = fs.statSync(filePath).size;
// fs.watch(filePath, function(event, trigger) {
fs.watchFile(filePath, function (current, previous) {
    //if (trigger) {
    if (current.mtime <= previous.mtime) {
        return;
    }
    
    let newFileSize = fs.statSync(filePath).size;
    let sizeDiff = newFileSize - fileSize;

    if (sizeDiff < 0) {
        fileSize = 0;
        sizeDiff = newFileSize;
    }

    let buffer = new Buffer.alloc(sizeDiff);
    let fileDes = fs.openSync(filePath, 'r');
    fs.readSync(fileDes, buffer, 0, sizeDiff, fileSize);
    fs.closeSync(fileDes);

    fileSize = newFileSize;
    parseBuffer(buffer);
    //}
});

function parseBuffer(buffer) {
    buffer.toString().split(eol).forEach(function (line) {
        console.log(line);
    });
}