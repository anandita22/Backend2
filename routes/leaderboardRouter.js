const express = require('express');

const router = express.Router();

const leaderboardController = require('../controllers/leaderboardController');
const authController = require('../controllers/authController');

router.post(
  '/score',
  authController.isLoggedIn,
  leaderboardController.saveScore
);

router.get(
  '/score',
  authController.isLoggedIn,
  leaderboardController.getScores
);

module.exports = router;
