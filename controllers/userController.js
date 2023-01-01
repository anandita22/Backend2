const userModel = require('../models/userModel');
const utils = require('../utils/utils');
const constants = require('../data/constants');

exports.getUserByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (username) {
      const user = await userModel.getUserByUsername(username, next);

      if (user) {
        return res.json({ success: true, data: user });
      } else {
        return res.json({ success: false, errors: null });
      }
    } else {
      return res.json({ success: false, errors: null });
    }
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    userData.role = constants.USER_ROLES.ADMIN;
    userData.password = await utils.hashPassword(userData.password, next);

    const user = await userModel.createUser(userData, next);
    if (user.status === 201) {
      console.log('New user account created!', user);
      return res.json({ success: true, data: user.user });
    } else {
      return res.json({ success: false, errors: user.err });
    }
  } catch (err) {
    next(err);
  }
};
