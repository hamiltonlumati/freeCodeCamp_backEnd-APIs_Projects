var express = require('express');
var app = express();
var dotenv = require('dotenv').config();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use("/public", express.static(path.join(__dirname, "/public")))

//Implement a Root-Level Request Logger Middleware
app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${req.ip}`);
        next();
    })
    //console.log(`Hello World`);
app.get('/', (req, res) => {
    res.send('Hello Express');
})

app.get('/', (req, res) => {
    absolutePath = __dirname + "/views/index.html";
    res.sendFile(absolutePath);
})

//static file
absolutePath = __dirname + "/public";
app.use(express.static(absolutePath))

//JSON
app.get("/json", (req, res) => {
    //.env
    if (process.env.MESSAGE_STYLE == "uppercase") {
        res.json({ "message": "HELLO JSON" })

    } else {
        res.json({ "message": "Hello json" })
    }

})


//Chain Middleware to Create a Time Server

app.get('/now', (req, res, next) => {
    req.time = new Date;
    next();
}, (req, res) => {
    res.json({ "time": req.time })
});

app.get("/:word/echo", (req, res) => {
    res.json({ "echo": req.params.word })
})

app.get("/name", function(req, res) {
    // Handle the data in the request
    var string = req.query.first + " " + req.query.last;
    res.json({ name: string });
});
app.post("/name", (req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    res.json({ name: `${first} ${last}` })
})





















module.exports = app;