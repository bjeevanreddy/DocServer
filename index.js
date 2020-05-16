const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const mongoose = require('mongoose');
const cors = require('cors');
require('./config/passportConfig');
const passport = require('passport');
const patrouter = require('./routes/patient.routes');
const docrouter =require('./routes/doctor.routes');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.get('/', function (req, res) {
    res.send('This is Doctor Appointment Application')
  })
app.use('/patapi',patrouter);
app.use('/docapi',docrouter);
//error validation

app.use((err, req, res, next) => {
    if (err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (!err)
        console.log("DataBase mongodb connected");
    else {
        console.log("Not Connected to DB :" + JSON.stringify(err, undefined, 2));
    }
});
//server
app.listen(process.env.PORT, () => {
    console.log(`Server Connected on :${process.env.PORT} `);
})