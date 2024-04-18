var express = require('express');
var router = express.Router();
var { getReceiverSocketId, io } = require('../socket/socket');
var Conversation = require('../schemas/conversation');
var Message = require('../schemas/message');
var protect = require('../middlewares/protectLogin');

router.get('/:id', protect, async function (req, res, next) {
  try {
    const receiverId = req.params.id;
    const senderId = req.user.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages');
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    console.log(error);
  }
});

router.post('/send/:id', protect, async function (req, res, next) {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }
    return res.status(201).json({
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
