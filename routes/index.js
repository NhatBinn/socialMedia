var express = require('express');
var router = express.Router();

// xuat ra api
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/post', require('./post'));

module.exports = router;
