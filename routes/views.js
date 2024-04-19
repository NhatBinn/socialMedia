var express = require('express');
var router = express.Router();
var user = require('../schemas/user');
var post = require('../schemas/post');
var Message = require('../schemas/message');
var protect = require('../middlewares/protectLogin');
// xuat front - end
//home index //localhost:3000/
router.get('/', protect, async function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  try {
    const posts = await post.find({ userId: req.user._id });
    res.render('index', { user: req.user, posts: posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).send('Internal Server Error');
  }
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
router.get('/profile', protect, async function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  try {
    const posts = await post.find({ userId: req.user._id });
    res.render('profile', { user: req.user, posts: posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// router.get('/message', protect, async function (req, res, next) {
//   if (!req.user) {
//     res.redirect('/login');
//     return;
//   }
//   try {
//     const activeUsers = await fetchActiveUsers(); // Fetch the list of active users from the server
//     const userId = await post.find({ userId: req.user._id });
//     res.render('message', { user: req.user, activeUsers }); // Pass activeUsers to the template
//   } catch (error) {
//     console.error('Error fetching active users:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

module.exports = router;
