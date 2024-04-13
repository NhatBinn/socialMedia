var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
let config = require('../configs/config');

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: [String],
    },
    status: {
      type: Boolean,
      default: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    bookmarks: {
      type: Array,
      default: [],
    },
    email: String,
    tokenResetPassword: String,
    tokenResetPasswordExp: String,
  },
  { timestamps: true },
);

userSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});

userSchema.methods.genJWT = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.JWT_SECRETKEY,
    { expiresIn: config.JWT_EXP },
  );
};

userSchema.methods.genResetPassword = function () {
  this.tokenResetPassword = crypto.randomBytes(30).toString('hex');
  this.tokenResetPasswordExp = Date.now() + 10 * 60 * 1000;
  return this.tokenResetPassword;
};

module.exports = new mongoose.model('user', userSchema);
