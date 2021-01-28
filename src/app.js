const http = require('http');
const port = 3000;

// Create server
const server = http.createServer(function(req, res) {
    res.write('Response write');
    res.end();
})

// Attempt to run server - listen on specified port for requests
server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
})