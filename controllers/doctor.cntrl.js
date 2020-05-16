const patsvc = require('../services/patients.svc');
const docsvc = require('../services/doctors.svc');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const doccntrl = {

    addDoctor: async function (req, res, next) {
        try {
            let pwd = req.body.password;
            req.body.password = bcrypt.hashSync(pwd, 2);
            let result = await docsvc.docRegister(req.body);
            if (result) {
                res.status(200).send("successful Registration");
            } else res.status(200).send("Registration Unsuccesfull");
        }
        catch (err) {
            if (err.code == 11000) { res.send(["Duplicate data"]); }
            else { return next(err); }
        }
    },
    loginDoc: async function (req, res) {
        try {
            passport.authenticate('doc-local', (err, doc, info) => {
                if (err) return res.status(400).json(err);

                //regsitered user
                else if (doc) {
                    let token = jwt.sign({ _id: doc._id },
                        process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXP
                    });
                    return res.status(200).json({ "token": token, "name": doc.username });
                }
                else return res.status(404).json(info);
            })(req, res);

        }
        catch (err) {
            res.status(500).send("Internal Server Error");
        }
    },
    docprofile: async function (req, res, next) {
        try {
            let doc = await docsvc.docProfile(req._id);
            if (doc) {
                res.json(doc).status(200);
            }
        }
        catch (err) {
            res.send("Internal Server error").status(500);
        }
    },
    getAppointments: async function (req, res, next) {
        try {
            let appointements_list = await docsvc.get_appointments(req._id);
            if (appointements_list.length < 1) {
                res.send({ status: 0, message: "You dont have any Bookings !!!!" }).status(200);
            } else {
                res.send({ status: 1, appointements_list }).status(200);
            }

        } catch (err) {
            res.send("Internal Server Error").status(500);
        }
    },
    change_Status: async function (req, res, next) {
        try {
            let doctor_profile = await docsvc.docProfile(req._id);
            let doc_status = req.body.status;
            doctor_profile.status = doc_status;
            doctor_profile.save();
            res.send("Changed Status Successfully").status(200);

        } catch (err) {
            res.send("Internal Server Error").status(500);
        }
    }


};

module.exports = doccntrl;