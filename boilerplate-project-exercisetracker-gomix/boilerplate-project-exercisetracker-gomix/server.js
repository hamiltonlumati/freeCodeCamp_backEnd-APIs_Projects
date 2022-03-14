const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Timestamp } = require('mongodb');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
mongoose.connect("mongodb+srv://hamiltonlumati:ICUI4CU10h!@cluster0.ovy9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
    username: String,
})
const exerciseSchema = new mongoose.Schema({
    userID: String,
    description: String,
    duration: Number,
    date: Date
})

const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model('User', userSchema);




const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})


app.post('/api/users', (req, res) => {
    const username = new User({ username: req.body.username });
    username.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ "username": result.username, "_id": result.id })
        }
    })
})

app.get("/api/users", (req, res) => {
    User.find({}, (err, result) => {
        res.json(result);
    });
})

app.post('/api/users/:_id/exercises', (req, res) => {
    var userId = req.params._id;
    var { description, duration, date } = req.body;
    if (!date) {
        date = new Date();
    }
    User.findById(userId, (err, result) => {
        if (!result) {
            res.send("Unknown userId " + userId);
        } else {
            const username = result.username;
            let exercise = new Exercise({ "userID": userId, "description": description, "duration": duration, "date": date });
            exercise.save((err, result) => {
                res.json({ _id: userId, username, date: new Date(date).toDateString(), duration: +duration, description })
            })
        }
    })
});

/* app.get('/api/users/:_id/logs', (req, res) => {
    User.find({}, (err, result) => {
        if (!result) {
            res.send("No Users")
        } else {
            res.json(result)
        }
    })
}) */

app.get('/api/users/:_id/logs', (req, res) => {
    let userId = req.params;
    const { from, to, limit } = req.query;
    console.log({ "from": from, "to": to, "limit": limit })
    console.log(userId);
    User.findById(userId, (err, result) => {
        if (!result) {
            res.send('Unknown User' + userId);
        } else {
            const username = result.username;
            if (from && to) {
                Exercise.find({
                        userID: userId,
                        date: { $gte: new Date(from) },
                        date: { $lte: new Date(to) }
                    })
                    .select(["userID", "description", "duration", "date"])
                    .limit(+limit)
                    .exec((err, result) => {
                        let customRes = result.map(exer => {
                            let dateFormatted = new Date(exer.date).toDateString();
                            return { userID: exer.userID, description: exer.description, duration: exer.duration, date: dateFormatted }
                        })
                        if (!result) {
                            res.json({
                                "_id": userId,
                                "username": username,
                                "count": 0,
                                "log": []
                            })
                        } else {
                            res.json({
                                "_id": userId,
                                "username": username,
                                "count": result.length,
                                "log": customRes
                            })
                        }
                    })
            } else {
                Exercise.find({
                        userID: userId
                    })
                    .select(["userID", "description", "duration", "date"])
                    .limit(+limit)
                    .exec((err, result) => {
                        let customRes = result.map(exer => {
                            let dateFormatted = new Date(exer.date).toDateString();
                            return { userID: exer.userID, description: exer.description, duration: exer.duration, date: dateFormatted }
                        })
                        if (!result) {
                            res.json({
                                "_id": userId,
                                "username": username,
                                "count": 0,
                                "log": []
                            })
                        } else {
                            res.json({
                                "_id": userId,
                                "username": username,
                                "count": result.length,
                                "log": customRes
                            })
                        }
                    })
            }

        }
    })
});