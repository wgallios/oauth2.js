process.title = 'oauth2-server';

var express = require('express'),
bodyParser = require('body-parser'),
http = require('http'),
mongoose = require('mongoose'),
oauthserver = require('node-oauth2-server');

var chalk = require('chalk');
var configFile = 'production';

var Log = require('log');
var log = new Log('info');

var app = express();
var server = http.createServer(app);

app.use(bodyParser.json()); // REQUIRED

config = require('./config/' + configFile);

var uristring = 'mongodb://' + config.db.user + ':' + config.db.pwd + '@' + config.db.host + ':' + config.db.port + '/' + config.db.name;

mongoose.connect(uristring, function (err, res) {
    if (err)
        log.error("Error Connecting to " + uristring + ". " + err);
    else
        log.info("Successfully connected to " + config.db.name + '!');
});


app.oauth = oauthserver({
    model: require('./models/mongodb.js'),
    grants: ['password', 'auth_code', 'refresh_token', 'authorization_code'],
    debug: true
});

//expressControllers
    //.setDirectory('/')
    //.bind(app);

require('./routes')(app);
app.use(app.oauth.errorHandler());

process.on('SIGTERM', function () {
    console.log("Term signal recieved");
    
    try
    {
        server.close(function (){
            console.log("Server has stopped");
            process.exit();
        });
    }
    catch (e)
    {
        console.log(e);
        process.exit(true);
    }

});

app.listen(config.port, config.ip);

console.log(chalk.bold.underline("\n\n-----------------------------------"));
console.log(chalk.bold.underline("OAuth2.0 Server Started @ http://%s:%s"), config.ip,  config.port);
console.log(chalk.bold.underline("-----------------------------------\n\n"));

