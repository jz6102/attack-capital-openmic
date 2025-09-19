const express = require('express');
const router = express.Router();
const postcallHandler = require('../controllers/postcallController');

router.use('/', postcallHandler);

module.exports = router;
