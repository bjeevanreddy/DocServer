const express = require('express');
const router = express.Router();
const defaultCtrl = require('../controllers/default.cntrl');

router.get('/', defaultCtrl.defaultCheck);
//router.get('/healthcheck', defaultCtrl.healthCheck);

module.exports = router;