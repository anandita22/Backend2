const { mongoose } = require('../dbConfig');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  URL: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'gameCategory'
  },
  leaderboard: {
    type: String,
    required: true
  },
  iframeURL: {
    type: String,
    default: ''
  },
  priority: {
    type: Number,
    default: 0
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

gameSchema.index({ name: 'text' });

module.exports = mongoose.model('game', gameSchema);
