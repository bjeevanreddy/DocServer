const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

let patSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Username must be given!!!'
    },
    email: {
        type: String,
        required: 'email should be given',
        unique: true
    },
    mobile: {
        type: String,
        required: 'MobileNo is required',
        unique: true
    },
    password: {
        type: String,
        required: 'Password Required!!',
        minlength: [6, "Password must be min 4 charcters"]
    },
    registeredOn: {
        type: Date, default: Date.now()
    },
    location: {
        type: String
    },
    appointments:[Object]
});

const patModel = mongoose.model("Patients", patSchema);

patSchema.path('email').validate((val) => {
    emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailregex.test(val);
}, 'Invalid email');

// patSchema.path('password').validate((val)=>{
//     passowrdregex= /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//     return passowrdregex.test(val);
// },"Password Doesn't meet Criteria");


// patSchema.methods.verifyPassword =function(password){
//     return bcryptjs.compareSync(password,this.password);
// }

// patSchema.methods.generateJwt=function()
// {
//     return jwt.sign({_id:this._id},
//         process.env.JWT_SECRET,{
//             expiresIn:process.env.JWT_EXP
//         });
// }

module.exports = patModel;