var util    = require('util'),
    path    = require('path'),
    express = require('express'),
    sr      = require('./static_require'),
    url     = require('url'),
    pro     = require('uglify-js').uglify,
    app     = express.createServer();

var root = path.normalize(path.join(__dirname, '..'));

function init() {
    app.get('/*.js', sr.getHandler({
        searchPaths: [root]
    }));

    app.get('/login.html', function(req, res) {
        res.sendfile('/login.html');
    });

    app.get('/favicon.ico', function(req, res) {
        res.sendfile(req.param(0))
    });

    app.get('*', function(req, res) {
        res.sendfile('index.html');
    });
};


var host = '127.0.0.1',
    port = 8001;

var fs = require('fs'),
    path = require('path');

try {
    require(path.join(process.cwd(), 'express.js')).init(dev_server.app);
    util.puts("Loaded m server");
} catch(e) {}

init();
app.listen(port, host);
util.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
