const express = require('express');
const router = express.Router();
const precallHandler = require('../controllers/precallController');

router.use('/', precallHandler);

module.exports = router;
