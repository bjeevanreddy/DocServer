const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    username:{
        type: String,
        required : "Is reqired"
    },
    password:{
        type: String,
        required: "Password is needed"
    }
})