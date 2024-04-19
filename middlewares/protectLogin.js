var jwt = require('jsonwebtoken');
var userModel = require('../schemas/user');
var resHand = require('../helpers/resHandle');
const config = require('../configs/config');

module.exports = async function (req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    if (req.cookies.token) {
      token = req.cookies.token;
    }
  }
  if (!token) {
    return res.redirect('/login');
  }
  try {
    let info = jwt.verify(token, config.JWT_SECRETKEY);
    if (info.exp * 1000 > Date.now()) {
      let id = info.id;
      let user = await userModel.findById(id);
      req.user = user;
      res.locals.userId = id; //luu id user vao` local
      next();
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    return res.redirect('/login');
  }
};
