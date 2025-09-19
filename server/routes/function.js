const express = require('express');
const router = express.Router();
const functionHandler = require('../controllers/functionController');

router.use('/', functionHandler);

module.exports = router;
