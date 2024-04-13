var mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userDetails: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);
module.exports = new mongoose.model('post', postSchema);
