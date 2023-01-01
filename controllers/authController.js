const userModel = require('../models/userModel');
const utils = require('../utils/utils');
const constants = require('../data/constants');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModel.getUserByEmail(email);
      if (user) {
        const isValid = await utils.verifyPassword(password, user.password);
        if (isValid === true) {
          const jwt = await utils.generateJWT({
            id: user._id,
            name: user.name,
            image: user.image,
            role: user.role
          });

          res.cookie('token', jwt, {
            maxAge: 1000 * 60 * 60 * 24 * 3,
            secure: false,
            httpOnly: false
          });

          return res.json({ success: true, token: jwt });
        } else {
          return res.json({
            success: false,
            msg: 'Email or password is incorrect!'
          });
        }
      } else {
        return res.json({
          success: false,
          msg: 'Email or password is incorrect!'
        });
      }
    } else {
      return res.json({
        success: false,
        msg: 'Invalid login details!'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'jwt', {
      maxAge: 1,
      secure: false,
      httpOnly: false
    });

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.token) {
    const tokenData = await utils.decodeToken(req.cookies.token);
    if (tokenData) {
      req.user = {};
      req.user.id = tokenData.id;
      req.user.name = tokenData.name;
      req.user.image = tokenData.image;
      req.user.role = tokenData.role;

      next();
    } else {
      return res.json({ status: 401, success: false, msg: 'not authorised!' });
    }
  } else {
    return res.json({ status: 404, success: false, msg: 'token not found!' });
  }
};

exports.isAdmin = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    const tokenData = await utils.decodeToken(token);
    if (tokenData && tokenData.role === constants.USER_ROLES.ADMIN) {
      next();
    } else {
      return res.json({ status: 401, success: false, msg: 'not authorised!' });
    }
  } else {
    return res.json({ status: 404, success: false, msg: 'token not found!' });
  }
};
