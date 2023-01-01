const Game = require('../db/schemas/gameSchema');
const categoryModel = require('./gameCategoryModel');

const utils = require('../utils/utils');

exports.addGame = async (gameData) => {
  try {
    const game = await Game.create(gameData);
    return {
      status: 201,
      game
    };
  } catch (err) {
    const errors = await utils.errorParser(err);
    console.log('addGame >> Error >>', errors);
    return {
      status: 500,
      err: errors
    };
  }
};

exports.getGameBySlug = async (slug, next) => {
  try {
    return await Game.findOne({ slug });
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getGameById = async (gameId, next) => {
  try {
    return await Game.findOne({ _id: gameId });
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.updateGame = async (gameId, gameData) => {
  try {
    return await Game.updateOne({ _id: gameId }, gameData);
  } catch (err) {
    return null;
  }
};

exports.deleteGameById = async (gameId) => {
  try {
    return await Game.deleteOne({ _id: gameId });
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getGamesByCategorySlug = async (categorySlug, skip, limit, next) => {
  try {
    const data = await Game.aggregate([
      {
        $lookup: {
          from: 'gamecategories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      {
        $match: { 'categoryData.slug': categorySlug, hidden: false }
      },
      {
        $group: {
          _id: null,
          games: {
            $push: {
              name: '$name',
              _id: '$_id',
              iframeURL: '$iframeURL',
              slug: '$slug',
              category: '$category',
              URL: '$URL',
              image: '$image',
              leaderboard: '$leaderboard'
            }
          }
        }
      },
      {
        $sort: { priority: -1 }
      },
      {
        $skip: skip
      },
      { $limit: limit }
    ]);

    if (data && data.length) {
      return data[0].games;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getGamesByCategoryId = async (categoryId, skip, limit) => {
  try {
    return await Game.find({ category: categoryId, hidden: false })
      .populate('category')
      .sort({ priority: -1 })
      .skip(skip)
      .limit(limit);
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.searchGames = async (query, next) => {
  try {
    return await Game.find({ name: new RegExp(query, 'i'), hidden: false })
      .sort({ priority: -1 })
      .populate({
        path: 'category'
      });
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getGames = async (skip, limit, next) => {
  try {
    return await Game.find({ hidden: false })
      .sort({ priority: -1 })
      .skip(skip)
      .limit(limit);
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getAdminGames = async (skip, limit, next) => {
  try {
    return await Game.find().sort({ priority: -1 }).skip(skip).limit(limit);
  } catch (err) {
    console.log(err);
    return [];
  }
};
