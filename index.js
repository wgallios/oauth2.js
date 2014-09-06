process.title = 'oauth2-server';

var express = require('express'),
bodyParser = require('body-parser'),
http = require('http'),
expressControllers = require('express-controller');
oauthserver = require('node-oauth2-server');

var configFile = 'production';
var app = express();
var server = http.createServer(app);

app.use(bodyParser()); // REQUIRED

config = require('./config/' + configFile);

/*app.oauth = oauthserver({*/
    //model: require('./models/mongodb.js'),
    //grants: ['password'],
    //debug: true
//});

expressControllers
    .setDirectory('./controllers')
    .bind(app);


// app.all('/oauth/token', app.oauth.grant());

// app.get('/', app.oauth.authorise(), function (req, res) {
//       res.send('Node.js OAuth 2.0 Server');
// });
//

// app.use(app.oauth.errorHandler());

app.listen(config.port);

console.log("-----------------------------------");
console.log("Auth2.0 Server Started on Port 8003");
console.log("-----------------------------------");

