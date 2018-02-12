var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

var app = express();
mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test') {
    mongoose.createConnection('mongodb://localhost/ticketking');
} else {
    mongoose.createConnection('mongodb://localhost/ticketking_test');
}

app.all('*', function(req, res, next) {
    next();
});

// CORS headers for local deploy
// CROSS ORIGIN RESOURCE FORGERY
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type,  X-Access-Token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware

    if( req.method === 'OPTIONS') {
        res.status(200);
        res.end();
    } else {
        next();
    }
});

app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
});

module.exports = app;
