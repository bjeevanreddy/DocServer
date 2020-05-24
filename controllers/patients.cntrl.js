const patsvc = require('../services/patients.svc');
const bcrypt = require('bcryptjs');
const docsvc = require('../services/doctors.svc');
const config=require('../config/config')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const patcntrl = {

    addPatient: async function (req, res, next) {
        try {
            let pwd = req.body.password;
            req.body.password = bcrypt.hashSync(pwd, 2);
            let result = await patsvc.patRegister(req.body);
            if (result) {
                res.status(200).send({message:"successful Registration"});
            } else res.status(200).send({message:"Registration Unsuccesfull"});
        }
        catch (err) {
            if (err.code == 11000) { res.send(["Duplicate data"]); }
            else { return next(err); }
            //res.status(500).send("Internal Server Error");
        }
    },
    loginPatient: async function (req, res) {
        try {
            passport.authenticate('pat-local', (err, pat, info) => {
                if (err) return res.status(400).json(err);

                //regsitered user
                else if (pat) {
                    let token = jwt.sign({ _id: pat._id },
                        config.JWT_SECRET, {
                            expiresIn: config.JWT_EXP
                    });
                    return res.status(200).json({ "token": token, "name": pat.username });
                }
                //unknown user or wrong passwrod

                else return res.status(404).json(info);
            })(req, res);

        }
        catch (err) {
            res.status(500).send("Internal Server Error");
        }
    },
    userprofile: async function (req, res, next) {
        try {
            let user = await patsvc.userprofile(req._id);
            // console.log(req._id);
            if (user) {
                res.json(user).status(200);
            }
        }
        catch (err) {

        }
    },
    getallDoc: async function (req, res, next) {
        try {
            let doclist = await patsvc.getdoctors();
            let doctors_list = [];
            for (var i = 0; i < doclist.length; i++) {
                console.log(doclist[i].status);
                if (doclist[i].status == "Active") {
                    doctors_list.push(doclist[i]);
                }
            }
            if (doctors_list.length > 0) {
                res.send(doctors_list).status(200);
            }
            else {
                res.send("No Doctors At the momment").status(200);
            }
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    },
    getDocBySpec: async function (req, res, next) {
        try {
            let spec = req.params.spec;
            let doclist = await patsvc.get_doctors_spec(spec);
            // console.log(doclist);
            if (doclist.length > 0) { res.send(doclist).status(200); }
            else { res.send("There are no doctors for that specialization").status(200); }
        } catch (err) {
            res.send("Internal Server Error").status(500);
        }
    },
    bookAppointment: async function (req, res, next) {
        try {

            let app_date = req.body.app_date;
            let x = new Date(new Date(app_date).toISOString());
            let appointmentlist = await patsvc.getAppointments(req._id);
            let canbebooked = datechecker(x);
            let hasappointment = appointment_date_finder(dateformatter(x), appointmentlist.appointments);
            let app_time = req.body.app_time;
            let docid = req.params.docid;
            let docdetails = await patsvc.getdocDetails(docid);
            let noslot = checkdoc(app_date, docdetails, app_time);
            //console.log(noslot);
            if (canbebooked) {
                if (!hasappointment || !noslot) {
                    res.send("You Cannot Take more than 1 Appointmnets in a single Day!!Take Tommorow.")
                        .status(200);
                }

                else {
                    appointmentlist.appointments
                        .push({ "Doctor_Name": docdetails.username, "Doctor_id": docdetails._id, "Booked_date": app_date, "Booked_Time": app_time });
                    appointmentlist.save();
                    docdetails.appointments.push({ "Patient_Name": appointmentlist.username, "Patient_id": appointmentlist._id, "Booked_Time": app_time, "Booked_date": app_date });
                    docdetails.save();
                    res.send({ "message": "Your Appointent Has been Booked!!!", "Details": appointmentlist.appointments })
                        .status(200);
                }
            } else {
                res.send("You can book appointment today or 5 days from today").status(200);
            }
        } catch (err) {
            res.send("Internal Server Error").status(500);
        }
    },
    doctor_timings: async function (req, res, next) {
        try {
            let docid = req.params.docid;
            let docdetails = await patsvc.getdocDetails(docid);
            let appointments = docdetails.appointments;
            let appdate = req.body.appdate;
            // console.log("hello");
            let timelist = [];
            for (var i = 0; i < appointments.length; i++) {
                // console.log(appointments[i].Booked_date == appdate);
                if (appointments[i].Booked_date == appdate) {
                    timelist.push(appointments[i].Booked_Time);
                    //console.log(timelist);  
                }
            }
            res.send(timelist).status(200);

        } catch (err) {
            res.send("Intrnal Server Error").status(500);
        }
    },
    cancelAppointment: async function (req, res, next) {
        try {
            let docid = req.params.docid;
            let appoint_date = req.params.appoint_date;
            let doc_appointments = await docsvc.get_appointments(docid);
            let pat_appointments = await patsvc.get_appointments(req._id);
            console.log(doc_appointments.appointments[0]);

            let patcancel = delete_pat_appoint(docid, appoint_date, pat_appointments.appointments);
            let doccancel = delete_doc_appoint(req._id, appoint_date, doc_appointments.appointments);
            console.log(patcancel,doccancel);
            if (patcancel && doccancel) {
                pat_appointments.appointments.save();
                doc_appointments.appointments.save();
                res.send({ "status": 1, "message": "Appointment has been Cancelled!!!" }).status(200);
            } else {
                res.send({ "status": 0, "message": "Something went wrong Please try Again Later!!" }).status(200);
            }


        } catch (err) {
            res.send("Internal Server Error").status(500);
        }
    }


};
function datechecker(date) {
    let todaydate = new Date(new Date().toISOString());
    let maxdate = new Date(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString());
    let diff = (maxdate - todaydate);
    canbook = false;
    if (date >= todaydate && date <= maxdate) {
        canbook = true;
    } else { canbook = false; }
    // console.log(todaydate, maxdate,diff/(24*60*60*1000));
    return canbook;

}
function appointment_date_finder(app_date, appointments) {
    hasappointment = false;
    noofbookings = 0;
    for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].Booked_date == app_date) {
            noofbookings++;
        }
    }
    if (noofbookings < 1) {
        hasappointment = true;
    }
    return hasappointment;

}
function dateformatter(date, time) {
    let date1 = new Date(date);
    let month = date1.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let zdate = date1.getDate();
    if (zdate < 10) {
        zdate = "0" + zdate;
    }
    return (date1.getFullYear() + "-" +
        month + "-" + zdate).toString();
}
function checkdoc(app_date, docdetails, app_time) {
    slotavailable = true;
    for (var i = 0; i < docdetails.appointments.length; i++) {
        if (docdetails.appointments[i].Booked_date == app_date && docdetails.appointments[i].Booked_Time == app_time) {
            slotavailable = false;
        }
    }
    return slotavailable;
}
function delete_pat_appoint(docid, appdate, appoint_list) {

    let pat_cancelled = false;
    console.log(appoint_list.length);
    for (let i = 0; i < appoint_list.length; i++) {
        if (appoint_list[i].Doctor_id == docid && appoint_list[i].Booked_date == appdate) {
            console.log("hello1");
            appoint_list.splice(i, 1);
            console.log(appoint_list.length);
            pat_cancelled = true;
            break;
        }
    }
    return pat_cancelled;
}
function delete_doc_appoint(patid, appdate, doc_appointment) {
    let doc_cancelled = false;
    console.log("hello2");
    for (let i = 0; i < doc_appointment.length; i++) {
        if (doc_appointment[i].Patient_id == patid && doc_appointment[i].Booked_date == appdate) {
            doc_appointment.splice(i, 1);
            console.log("hello3");
            doc_cancelled = true;
            break;
        }
    }
    return doc_cancelled;
}

module.exports = patcntrl;