const Leaderboard = require('../db/schemas/leaderboardSchema');

exports.saveScore = async (scoreData, next) => {
  try {
    const isExist = await Leaderboard.findOne({
      user: scoreData.user,
      game: scoreData.game
    });

    if (isExist === null) {
      return await Leaderboard.create(scoreData);
    } else {
      if (scoreData.score > isExist.score) {
        isExist.score = scoreData.score;
        await isExist.save();
      }
      return isExist;
    }
  } catch (err) {
    next(err);
  }
};

exports.getScores = async (gameId) => {
  try {
    return await Leaderboard.find({ game: gameId }, { score: 1, user: 1 })
      .sort({
        score: -1
      })
      .populate({
        path: 'user',
        select: 'name image'
      });
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getUserScore = async (gameId, userId) => {
  try {
    const score = await Leaderboard.findOne(
      { game: gameId, user: userId },
      {
        _id: 0,
        score: 1
      }
    ).sort({
      score: -1
    });

    if (score) {
      return score.score;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
};

exports.getUserRank = async (gameId, userId) => {
  try {
    const scoreDetails = await Leaderboard.find({
      game: gameId
    }).sort({
      score: -1
    });

    const userRankIndex = scoreDetails.findIndex((record) => {
      return record.user == userId;
    });

    if (userRankIndex > -1) {
      return userRankIndex + 1;
    } else {
      return '--';
    }
  } catch (err) {
    console.log(err);
    return '--';
  }
};
