const User = require('../db/schemas/userSchema');
const utils = require('../utils/utils');

exports.createUser = async (userData, next) => {
  try {
    const user = await User.create(userData);
    return {
      status: 201,
      user
    };
  } catch (err) {
    const errors = await utils.errorParser(err);
    console.log('createUser >> Error >>', errors);
    return {
      status: 500,
      err: errors
    };
  }
};

exports.getUserByUsername = async (username, next) => {
  try {
    return await User.findOne({ username }, { password: 0 });
  } catch (err) {
    next(err);
  }
};

exports.getUserByEmail = async (email, next) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    next(err);
  }
};
