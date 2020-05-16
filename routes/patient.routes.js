const express = require('express');

const router = express.Router();
const parcntrl = require('../controllers/patients.cntrl');
const middleware = require('../config/jwtHelper');
router.post('/signup', parcntrl.addPatient);
router.post('/login', parcntrl.loginPatient);
router.get('/profile', middleware.verifyJwtTokenPat, parcntrl.userprofile);
router.get('/getdocs',middleware.verifyJwtTokenPat,parcntrl.getallDoc);
router.get('/getdocspec/:spec',middleware.verifyJwtTokenPat,parcntrl.getDocBySpec);
router.get('/book/:docid',middleware.verifyJwtTokenPat,parcntrl.bookAppointment);
router.get('/book/times/:docid',middleware.verifyJwtTokenPat, parcntrl.doctor_timings);
router.get('/cancel/:docid/:appoint_date',middleware.verifyJwtTokenPat,parcntrl.cancelAppointment);
module.exports = router;