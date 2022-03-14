require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const urlparser = require('url');
const { urlencoded } = require('body-parser');

mongoose.connect("mongodb+srv://hamiltonlumati:ICUI4CU10h!@cluster0.ovy9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

const schema = new mongoose.Schema({
    url: String,
})

const Url = mongoose.model('url', schema);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl', (req, res) => {
    console.log(req.body);
    const bodyurl = req.body.url;
    const something = dns.lookup(urlparser.parse(bodyurl).hostname,
        (err, address) => {
            if (!address) {
                res.json({ error: "Invalid URL" })
            } else {
                const url = new Url({ url: bodyurl });
                url.save((err, data) => {
                    res.json({
                        original_url: data.url,
                        short_url: data._id
                    })
                })
            }
        })
})
app.get('/api/shorturl/:id', (req, res) => {
    const id = req.params.id;
    Url.findById(id, (err, data) => {
        if (!data) {
            res.json({ error: "Invalid URL" })
        } else {
            res.redirect(data.url)
        }
    })
})