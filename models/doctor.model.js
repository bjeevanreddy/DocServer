const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const docSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "Username is required"
    },
    email: {
        type: String,
        required: "Email is required",
        unique: true
    },
    password: {
        type: String,
        required: " Password needed",
        minlength: [8, "password sholud be atleaast 6"]
    },
    specialization: {
        type: String,
    },
    yearsofExp: {
        type: String
    },
    fee: {
        type: String
    },
    timings: {
        type: String,
    },
    available: {
        type: String
    },
    registeredOn: {
        type: Date, default: Date.now()
    },
    appointments: [Object],
    status: {
        type: String,
        default: "Active"
    }
});

const docModel = mongoose.model("doctors", docSchema);

docSchema.path('email').validate((val) => {
    emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailregex.test(val);
}, 'Invalid email');


docSchema.path('password').validate((val) => {
    passowrdregex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passowrdregex.test(val);
}, "Password Doesn't meet Criteria");


docSchema.methods.verifyPassword = function (password) {
    return bcryptjs.compareSync(password, this.password);
}

docSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP
    });
}
module.exports = docModel;

