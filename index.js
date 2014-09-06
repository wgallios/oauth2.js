var express = require('express'),
bodyParser = require('body-parser'),
oauthserver = require('node-oauth2-server');

var app = express();

app.use(bodyParser()); // REQUIRED

app.oauth = oauthserver({
      model: {}, // See below for specification
        grants: ['password'],
          debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
      res.send('Secret area');
});

app.use(app.oauth.errorHandler());

app.listen(3000);
