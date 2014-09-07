#! /user/bin/env node

var oauth = require('commander');
var chalk = require('chalk');
var model = require('./models/mongodb');
var mongoose = require('./models/mongodb').mongoose;
var prompt = require('prompt');
var promise = require('promise');
var request = require('request');

console.log(chalk.yellow.underline(process.argv));

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

            request({
                url: 'http://127.0.0.1:' + config.port + '/oauth/token',
                method:'post',
                form: {
                    grant_type: 'password',
                    response_type: 'code',
                    client_id: res.username,
                }
                /*,oauth: {*/
                    //callback: 'http://127.0.0.1',
                    //consumer_key: res.username,
                    //consumer_secret: res.password
                /*}*/
            }, function (err, res, body) {
                if (err)
                {
                    console.log(err);
                    process.exit(true);
                }

                console.log(body);
            });

            /*
            model.getUser(res.username, res.password, function(err, data) {
                console.log(data);
            });
            */
        });

    }

});
