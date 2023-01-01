const bcrypt = require('bcrypt');
const moment = require('moment');
const path = require('path');
const admZip = require('adm-zip');
const rimraf = require('rimraf');
const multiparty = require('multiparty');
const mv = require('mv');
const JWT = require('jsonwebtoken');

const saltRounds = 10;

exports.hashPassword = async (plainPassword, next) => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (err) {
    next(err);
  }
};

exports.verifyPassword = async (plainPassword, hashPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (err) {
    return null;
  }
};

exports.errorParser = async (err) => {
  try {
    const errors = [];
    if (err.code === 11000) {
      const path = Object.keys(err.keyValue)[0];
      errors.push({
        path: path,
        type: 'unique'
      });

      return errors;
    }

    if (err.errors) {
      const errs = Object.values(err.errors);
      errs.forEach((e) => {
        errors.push({
          path: e.properties.path,
          type: e.properties.type
        });
      });
    }

    return errors;
  } catch (err) {
    console.log(err);
  }
};

exports.zipUploader = async (req) => {
  return new Promise((resolve, reject) => {
    if (req.files) {
      const slug = req.body.slug;
      const zip = new admZip(req.files.game_zip.path);
      const gamePath = path.join(`${__dirname}`, '..', 'public', 'games', slug);

      rimraf(gamePath, function (err) {
        if (!err) {
          zip.extractAllToAsync(gamePath, false, (err) => {
            if (!err) {
              resolve({
                success: true,
                msg: 'Zip uploaded!'
              });
            } else {
              console.log(err);
              resolve({
                success: false,
                msg: 'Unable to upload zip!'
              });
            }
          });
        } else {
          console.log(err);
          resolve({
            success: false,
            msg: 'Unable to remove game file!'
          });
        }
      });
    } else {
      resolve({
        success: false,
        msg: 'Zip not found!'
      });
    }
  });
};

exports.zipRemover = async (slug) => {
  return new Promise((resolve, reject) => {
    const gamePath = path.join(`${__dirname}`, '..', 'public', 'games', slug);

    rimraf(gamePath, function (err) {
      if (!err) {
        resolve({
          success: true,
          msg: 'Game files removed!'
        });
      } else {
        console.log(err);
        resolve({
          success: false,
          msg: 'Unable to remove game file!'
        });
      }
    });
  });
};

exports.parseMultipartData = async (req, res, next) => {
  try {
    const form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
      if (err) {
        next(err);
        return;
      }

      const body_data = {};
      const files_data = {};

      for (let field in fields) {
        body_data[field] = fields[field][0];
      }

      for (let field in files) {
        files_data[field] = files[field][0];
      }

      req.body = body_data;
      req.files = files_data;
      next();
    });
  } catch (err) {
    next(err);
  }
};

exports.imageUploader = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      if (req.files && req.files.image) {
        const file = `${Date.now()}_${req.files.image.originalFilename}`;
        const fileName = path.join(
          __dirname,
          '..',
          'public',
          'assets',
          'images',
          file
        );

        mv(req.files.image.path, fileName, (err) => {
          if (err) {
            resolve({
              success: false,
              msg: 'Uable to upload game image!'
            });
          } else {
            resolve({ success: true, URL: `/assets/images/${file}` });
          }
        });
      } else {
        resolve({
          success: false,
          msg: 'Please select game image!'
        });
      }
    } catch (err) {
      console.log(err);
      resolve({
        success: false,
        msg: 'Uable to upload game image!'
      });
    }
  });
};

exports.generateJWT = async (data) => {
  try {
    return JWT.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 3 // 3 Days
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.decodeToken = async (token) => {
  try {
    if (token) {
      return JWT.verify(token, process.env.JWT_SECRET_KEY);
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.formatTimer = (endTime) => {
  const eventTime = endTime;
  const currentTime = new Date().getTime();
  const diffTime = eventTime - currentTime;
  const duration = moment.duration(diffTime, 'milliseconds');

  let days = duration.get('days');
  let hours = duration.get('hours');
  let minutes = duration.get('minutes');
  let seconds = duration.get('seconds');

  if (days < 10) {
    days = `0${days}`;
  } else {
    days = `${days}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  } else {
    hours = `${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  } else {
    minutes = `${minutes}`;
  }

  if (seconds < 10) {
    seconds = `0${seconds}`;
  } else {
    seconds = `${seconds}`;
  }

  return {
    days,
    hours,
    minutes,
    seconds
  };
};
