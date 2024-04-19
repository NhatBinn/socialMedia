var express = require('express');
var Tweet = require('../schemas/post');
var User = require('../schemas/user');
var router = express.Router();

router.get('/alltweets/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserTweets = await Tweet.find({ userId: id });
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      }),
    );
    return res.status(200).json({
      tweets: loggedInUserTweets.concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
});
router.get('/alltweets', async function (req, res, next) {
  try {
    const allTweets = await Tweet.find();
    return res.status(200).json({ tweets: allTweets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'error alltweets' });
  }
});
router.get('/followingtweets/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      }),
    );
    return res.status(200).json({
      tweets: [].concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/create', async function (req, res, next) {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(401).json({
        message: 'Fields are required.',
        success: false,
      });
    }
    const user = await User.findById(id).select('-password');
    await Tweet.create({
      description,
      userId: id,
      userDetails: user,
    });
    return res.status(201).json({
      message: 'Tweet created successfully.',
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

//like or dislike
router.put('/like/:id', async function (req, res, next) {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (tweet.like.includes(loggedInUserId)) {
      // dislike
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
      return res.status(200).json({
        message: 'User disliked your tweet.',
      });
    } else {
      // like
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
      return res.status(200).json({
        message: 'User liked your tweet.',
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete('/delete/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: 'Post deleted successfully.',
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
