const { mongoose } = require('../dbConfig');

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  game: {
    type: mongoose.Types.ObjectId,
    ref: 'game'
  },
  score: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('leaderboard', leaderboardSchema);