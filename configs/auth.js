// import jwt from 'jsonwebtoken';
// import config from 'config';
// config.config({
//   path: '../config/config.js',
// });

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         message: 'User not authenticated.',
//         success: false,
//       });
//     }
//     const decode = await jwt.verify(token, JWT_SECRETKEY);
//     req.user = decode.userId;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };
// export default isAuthenticated;
