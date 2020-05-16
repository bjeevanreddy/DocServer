const express = require('express');

const router = express.Router();
const parcntrl = require('../controllers/patients.cntrl');
const doccntrl=require('../controllers/doctor.cntrl');
const middleware = require('../config/jwtHelper');

router.post('/signup', doccntrl.addDoctor);
router.post('/login', doccntrl.loginDoc);
router.get('/profile', middleware.verifyJwtTokenDoc, doccntrl.docprofile);
router.get('/appointments',middleware.verifyJwtTokenDoc,doccntrl.getAppointments);
router.get('/changestatus',middleware.verifyJwtTokenDoc,doccntrl.change_Status);
module.exports = router;