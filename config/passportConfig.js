const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcryptjs=require('bcryptjs');
const patient=require('../models/patients.model');
const doctor=require('../models/doctor.model');
passport.use('pat-local',
    new localStrategy({usernameField:'email'},
    (username,password,done)=>{
        patient.findOne({email:username},
            (err,user)=>{
                let pwd= bcryptjs.compareSync(password,user.password);
                if(err){
                    return done(err);
                }
                else if(!user){
                    return done(null,false,{message: "Email is not registered"});
                }
                
                else if(!pwd){
                    return done(null,false,{message:"wrong password"});
                }
                else
                    return done(null,user);
            });
})
);

passport.use('doc-local',
    new localStrategy({usernameField:'email'},
    (username,password,done)=>{
        doctor.findOne({email:username},
            (err,doc)=>{
                let pwd=bcryptjs.compareSync(password,doc.password);
                if(err){
                    return done(err);
                }
                else if(!doc){
                    return done(null,false,{message: "Email is not registered"});
                }
                else if(!pwd){
                    return done(null,false,{message:"wrong password"});
                }
                else
                    return done(null,doc);
            });

})
);
