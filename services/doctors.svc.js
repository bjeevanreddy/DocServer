const patmodel = require('../models/patients.model');

const docmodel = require('../models/doctor.model');

const docsvc = {
    docRegister(data) {
        let doctor = new docmodel(data);
        return doctor.save();
    },
    docProfile(id) {
        return docmodel.findById({ _id: id }).exec();
    },
    get_appointments(id) {
        return docmodel.findById({ _id: id }, { appointments: 1, _id: 0 }).exec();
    }
};

module.exports = docsvc;