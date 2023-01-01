const { mongoose } = require('../dbConfig');
const constants = require('../../data/constants');

const tournamentSchema = new mongoose.Schema({
  game: {
    type: mongoose.Types.ObjectId,
    ref: 'game',
    required: true
  },
  startDate: {
    type: Number,
    default: Date.now()
  },
  endDate: {
    type: Number,
    required: true
  },
  prizes: [
    {
      position: String,
      prize: Number
    }
  ],
  status: {
    type: String,
    default: constants.TOURNAMENT.LIVE
  },
  maxScorePerMinute: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('tournament', tournamentSchema);
