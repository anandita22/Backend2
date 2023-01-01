const leadeboardModel = require('../models/leaderboardModel');

exports.saveScore = async (req, res, next) => {
  try {
    const { gameId, score } = req.body;

    const scoreData = {
      user: req.user.id,
      game: gameId,
      score
    };

    const result = await leadeboardModel.saveScore(scoreData, next);
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getScores = async (req, res, next) => {
  try {
    const gameId = req.query.gameId;
    if (gameId) {
      const allScores = await leadeboardModel.getScores(gameId);
      const userRank = await leadeboardModel.getUserRank(gameId, req.user.id);
      const userScore = await leadeboardModel.getUserScore(gameId, req.user.id);

      return res.json({
        status: 200,
        success: true,
        data: { allScores, userData: { ...req.user, userRank, userScore } }
      });
    } else {
      return res.json({ status: 404, success: false, data: [] });
    }
  } catch (err) {
    console.log(err);
    return res.json({ status: 500, success: false, data: [] });
  }
};
