var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user');
var checkvalid = require('../validators/user');
var { validationResult } = require('express-validator');
var protectLogin = require('../middlewares/protectLogin');
var protectRole = require('../middlewares/protectRole');
// var isAuthenticated = require('../configs/auth');
require('express-async-errors');

router.get('/', protectLogin, protectRole('ADMIN', 'MODIFIER'), async function (req, res, next) {
  let users = await userModel.find({}).exec();
  res.status(200).send(users);
});

router.get('/:id', async function (req, res, next) {
  try {
    let user = await userModel.find({ _id: req.params.id }).exec();
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post('/', checkvalid(), protectLogin, protectRole('ADMIN'), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    res.status(404).send(result.errors);
    return;
  }
  try {
    var newUser = new userModel({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: req.body.role,
    });
    await newUser.save();
    res.status(200).send({
      success: true,
      data: newUser,
    });
    throw new Error('heheehehehe');
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error,
    });
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate(req.params.id, req.body).exec();
    res.status(404).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let user = await userModel
      .findByIdAndUpdate(
        req.params.id,
        {
          status: false,
        },
        {
          new: true,
        },
      )
      .exec();
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.put('/bookmark/:id', async function (req, res, next) {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await userModel.findById(loggedInUserId);
    if (user.bookmarks.includes(tweetId)) {
      // remove
      await userModel.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
      return res.status(200).json({
        message: 'Removed from bookmarks.',
      });
    } else {
      // bookmark
      await userModel.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
      return res.status(200).json({
        message: 'Saved to bookmarks.',
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/follow/:id', async function (req, res, next) {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await userModel.findById(loggedInUserId);
    const user = await userModel.findById(userId);
    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already followed to ${user.name}`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} just follow to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/unfollow/:id', async function (req, res, next) {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await userModel.findById(loggedInUserId);
    const user = await userModel.findById(userId);
    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed yet`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} unfollow to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
