var express = require('express');
var router = express.Router();
var user = require('../schemas/user');
var post = require('../schemas/post');
var protect = require('../middlewares/protectLogin');
// xuat front - end
//home index //localhost:3000/
router.get('/', protect, function (req, res, next) {
  res.render('index', { title: 'Express', user });
});
//login //localhost:3000/login
router.get('/login', function (req, res, next) {
  res.render('login');
});

//login //localhost:3000/register
router.get('/register', function (req, res, next) {
  res.render('register');
});
//profile //localhost:3000/profile
router.get('/profile', function (req, res, next) {
  res.render('profile', user, post);
});

module.exports = router;
