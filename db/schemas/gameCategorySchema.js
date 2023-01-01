const { mongoose } = require('../dbConfig');

const gameCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('gameCategory', gameCategorySchema);
