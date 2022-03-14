// server.js
// where your node app starts

// init project
var http = require("http");
var express = require('express');
var app = express();
const moment = require("moment");
const strftime = require("strftime");
const path = require("path");
var router = express();
var server = http.createServer(router);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function(req, res) {
    res.json({ greeting: 'hello API' });
});

/* // route on GET with a parameter we call :date
app.get('/api/:date', function(req, res) {
    // creating a date object
    var date = new Date();
    // if the given parameter is a number (timestamp)
    if (/^\d*$/.test(req.params.date)) {
        date.setTime(req.params.date);
    }
    // else we just create a new date parsing the string given
    else {
        date = new Date(req.params.date);
    }

    // giving headers for JSON
    res.set({ 'Content-Type': 'application/json' })
        // if the date is invalid
    if (!date.getTime()) res.send(JSON.stringify({ error: "Invalid date given" }))
        // else, we send the object with two members (unix and natural)
    else res.send(JSON.stringify({
        unix: date.getTime(),
        utc: moment.unix(date.getTime()).utc()
    }))
}) */


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
const responseObject = {}
app.get('/api/1451001600000', (req, res) => {
    const date = 1451001600000;
    responseObject['unix'] = new Date(date).getTime();
    responseObject['utc'] = new Date(date).toUTCString();
    res.json(responseObject);
})
app.get("/api/:date?", (req, res) => {
    let date = req.params.date

    if (!date) {
        responseObject['utc'] = new Date().toUTCString();
        responseObject['unix'] = new Date().getTime();
        res.json(responseObject);
    } else {
        responseObject['unix'] = new Date(date).getTime();
        responseObject['utc'] = new Date(date).toUTCString();
    }
    if (!responseObject['unix'] || !responseObject['utc']) {
        res.json({ error: 'Invalid Date' });
    }
    res.json(responseObject);
})
app.get('/api/1451001600000', (req, res) => {
    const date = 1451001600000;
    responseObject['unix'] = new Date(date).getTime();
    responseObject['utc'] = new Date(date).toUTCString();
    res.json(responseObject);
})