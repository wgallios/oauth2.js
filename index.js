process.title = 'oauth2-server';

var express = require('express'),
bodyParser = require('body-parser'),
http = require('http'),
readdir = require('fs').readdirSync,
extname = require('path').extname,
join = require('path').join,
oauthserver = require('node-oauth2-server');

var configFile = 'production';
var app = express();
var server = http.createServer(app);

var controllerPath = app.set('controllers path') || 'controllers/';

config = require('./config/' + configFile);

app.oauth = oauthserver({
    model: require('./models/mongodb.js'),
    grants: ['password'],
    debug: true
});



app.use(bodyParser()); // REQUIRED

app.all('/oauth/token', app.oauth.grant());

readdir(controllerPath).forEach(function(file){
    var loaded = [];
    var self = app || this;
    
    if (file.match(/^.*.js$/ig)) {
        
        var controller = file.replace(extname(file), '');

        loaded.push(controller);
      
        if (typeof self.resource !== 'undefined') {
            loaded[controller] = self.resource(controller, require(join(controllerPath, controller)));
        }
    }
});

app.get('/', app.oauth.authorise(), function (req, res) {
      res.send('Node.js OAuth 2.0 Server');
});


app.use(app.oauth.errorHandler());

app.listen(config.port);

console.log("Auth2.0 Server Started on Port 8003");

