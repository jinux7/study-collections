var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./ssl/privatekey.pem', 'utf8'),
    certificate = fs.readFileSync('./ssl/certificate.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
app.use('/', express.static('public'));

var httpsServer = https.createServer(credentials, app);
var SSLPORT = 3000;

httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
