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
    // Chuyển hướng trực tiếp về trang đăng nhập nếu không có token
    return res.redirect('/login');
  }
  try {
    let info = jwt.verify(token, config.JWT_SECRETKEY);
    if (info.exp * 1000 > Date.now()) {
      let id = info.id;
      let user = await userModel.findById(id);
      req.user = user;
      // Lưu userId vào biến locals để sử dụng trong các route khác
      res.locals.userId = id;
      next();
    } else {
      // Chuyển hướng trực tiếp về trang đăng nhập nếu token hết hạn
      return res.redirect('/login');
    }
  } catch (error) {
    // Chuyển hướng trực tiếp về trang đăng nhập nếu có lỗi xác thực token
    return res.redirect('/login');
  }
};
