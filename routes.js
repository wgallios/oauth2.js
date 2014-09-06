
module.exports = function (app)
{
    app.all('/oauth/token', app.oauth.grant());

    app.get('/', app.oauth.authorise(), function (req, res) {
         res.send('Node.js OAuth 2.0 Server');
    });


    app.get('/test', function (req, res) {
        res.send("Test route");
    });
};
