#! /user/bin/env node

var oauth = require('commander');
var chalk = require('chalk');
var model = require('./models/mongodb');
var mongoose = require('./models/mongodb').mongoose;
var prompt = require('prompt');
var promise = require('promise');
var request = require('superagent');

console.log(chalk.yellow.bold.underline(process.argv));

var config = require('./config/production');


var uristring = 'mongodb://' + config.db.user + ':' + config.db.pwd + '@' + config.db.host + '/' + config.db.name;

// function to connection to db
var connectDB = function ()
{
    return new promise(function(resolve, reject) {

        mongoose.connect(uristring, function (err, res) {
            if (err)
            {
                reject(err);
                console.log("Error Connecting to " + uristring + ". " + err);
                process.exit(true);
            }
            else
            {
                // console.log("Successfully connected to " + config.db.name + '!');
                resolve(res);
            }
        });

    });
}

connectDB().then(function() {

oauth
    .version('0.0.1')
    .option('-c, --create', 'Create a new client')
    .option('-t, --test', 'Test Authentication')
    .parse(process.argv);

    if (oauth.create)
    {

        var userData = {};

        prompt.start();
        prompt.get([
            { name: 'username', required: true },
            { name: 'password', required: true, hidden: true },
            { name: 'firstname', message: 'First Name' },
            { name: 'lastname', message: 'Last Name' }, 
            { name: 'email', message: 'E-Mail' }
        ], function(err, res){
            userData.username = res.username;
            userData.password = res.password;
            userData.email = res.email;
            userData.firstname = res.firstname;
            userData.lastname = res.lastname;

            model.createUser(userData, function(err, user){
                if (err)
                {
                    console.log(err);
                    process.exit(true);
                }
                else
                {
                    console.log(user);
                    console.log(chalk.green("User has been created!"));
                    process.exit(true);
                }
            });

        });
    }

    if (oauth.test)
    {

        prompt.start();
        prompt.get([
            { name: 'username', required: true },
            { name: 'password', required: true, hidden: true }
        ], function(err, res){

        // var url =  'http://127.0.0.1:' + config.port + '/oauth/authorize?response_type=code&redirect_uri=' + encodeURI('http://127.0.0.1:8803') + '&client_id=' + res.username;

        var url = 'http://127.0.0.1:' + config.port + '/oauth/token';

        console.log(chalk.bold.underline('Url: %s'), url);
        
        request
            .post(url)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                grant_type: 'password',
                client_id: 'xxx',
                client_secret: res.password,
                client_user: res.username,
                password: res.password
            })
            .end(function (res) {
                console.log(res);

                process.exit(true);
            });
        });

    }

});
