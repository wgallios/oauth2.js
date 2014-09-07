
module.exports = function (app)
{
    app.all('/oauth/token', function(req, res, next) { next()  }, app.oauth.grant(function(req, res, next){
        next();
    }));

    /*
    app.get('/oauth/authorize', function(req, res, next) {
        res.render('authorize', {
            client_id: res.query.client_id,
            redirect_uri: req.query.redirect_uri
        });

    });

    app.post('oauth/authorize', function (req, res, next) {

        next();
    }, app.oauth.authCodeGrant(function(req, next) {

        next(null, req.body.allow === 'yes', 0, null);
    }));
    // login route
    app.post('/login', function (req, res, next) {
        
    });

    */
    app.get('/', app.oauth.authorise(), function (req, res) {
         res.send('Node.js OAuth 2.0 Server');
    });


    app.get('/public', function (req, res) {
        res.send("Node.js Oauth 2.0 Public Area");
    });
};
