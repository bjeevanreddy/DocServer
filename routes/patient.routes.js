const express = require('express');

const router = express.Router();
const patcntrl = require('../controllers/patients.cntrl');
const middleware = require('../config/jwtHelper');
router.post('/signup', patcntrl.addPatient);
router.post('/login', patcntrl.loginPatient);
router.get('/profile', middleware.verifyJwtTokenPat, patcntrl.userprofile);
router.get('/getdocs',middleware.verifyJwtTokenPat,patcntrl.getallDoc);
router.get('/getdocspec/:spec',middleware.verifyJwtTokenPat,patcntrl.getDocBySpec);
router.get('/book/:docid',middleware.verifyJwtTokenPat,patcntrl.bookAppointment);
router.get('/book/times/:docid',middleware.verifyJwtTokenPat, patcntrl.doctor_timings);
router.get('/cancel/:docid/:appoint_date',middleware.verifyJwtTokenPat,patcntrl.cancelAppointment);
module.exports = router;