const { v4: uuidv4 } = require('uuid');

const users = require('../data/onlineUsers');

exports.initSocket = function (io) {
  // Allow CORS
  io.origins((origin, callback) => {
    // if (origin !== 'https://foo.example.com') {
    //   return callback('origin not allowed', false);
    // }

    callback(null, true);
  });

  // Custom ID Generation
  io.engine.generateId = (req) => uuidv4();

  io.on('connection', function (socket) {
    console.log('New User Connected..!', socket.id);

    // Disconnect
    socket.on('disconnect', (reason) => {});
  });
};
