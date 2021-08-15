const Tail = require('tail').Tail;

const dataPath = './data/data.txt';
let tail = new Tail(dataPath);
tail.watch();
tail.on("line", data => {
    console.log(data);
});