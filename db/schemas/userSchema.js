const { mongoose } = require('../dbConfig');
const { v4: uuidv4 } = require('uuid');
const userImages = require('../../data/userImages');
const { getRandomNumber } = require('../../utils/utils');

const constants = require('../../data/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: `${process.env.DOMAIN}${
      userImages[getRandomNumber(0, userImages.length - 1)]
    }`
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  socketId: {
    type: String,
    default: uuidv4()
  },
  role: {
    type: String,
    default: constants.USER_ROLES.USER
  }
});

module.exports = mongoose.model('user', userSchema);
