const patmodel = require('../models/patients.model');

const docmodel = require('../models/doctor.model');

const patsvc = {
    patRegister(data) {
        let patient = new patmodel(data);
        return patient.save();
    },
    userprofile(id) {
        return patmodel.findById({ _id: id }).exec();
    },
    getdoctors() {
        return docmodel.find({}, { _id: 0, password: 0, __v: 0, appointments: 0, registeredOn: 0 }).exec();
    },
    get_doctors_spec(spec) {
        return docmodel.find({ specialization: spec }, { registeredOn: 0, __v: 0, password: 0 }).exec();
    },
    getAppointments(id) {
        return patmodel.findById({ _id: id }).exec();
    },
    getdocDetails(id) {
        return docmodel.findById({ _id: id }, { __v: 0, registeredOn: 0, password: 0 }).exec();
    },
    get_appointments(id) {
        return patmodel.findById({ _id: id }, { appointments: 1, _id: 0 }).exec();
    }
};

module.exports = patsvc;