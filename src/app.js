const http = require('http');
const fs = require('fs');
const port = 3000;

// Create server
const server = http.createServer(function(req, res) {
    // Tell server to render html
    res.writeHead(200, {'Content-Type': 'text/html'}); // Status code 200 = success
    fs.readFile('index.html', function(error, data) {
        if (error) {
            res.writeHead(404); // Status code 404 = error since can't find html we are trying to write
            res.write('Error: File not found');
        } else {
            res.write(data);
        }
        res.end();
    })
})

// Attempt to run server - listen on specified port for requests
server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
})