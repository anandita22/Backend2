const gameModel = require('../models/gameModel');
const gameCategoryModel = require('../models/gameCategoryModel');
const utils = require('../utils/utils');

exports.getGameBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    if (slug) {
      const game = await gameModel.getGameBySlug(slug, next);
      if (game) {
        return res.json({
          success: true,
          game
        });
      } else {
        return res.json({
          success: false,
          game: null
        });
      }
    } else {
      return res.json({
        success: false,
        msg: 'One ore more parameter is required'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.addGame = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      category,
      leaderboard,
      iframeURL,
      priority,
      hidden
    } = req.body;

    if (!iframeURL) {
      if (!(req.files && req.files.game_zip)) {
        return res.json({
          success: false,
          errors: [
            {
              path: 'GameZip',
              type: 'required'
            }
          ]
        });
      }
    }

    if (name && slug && category) {
      const isGameExist = await gameModel.getGameBySlug(slug, next);
      if (!isGameExist) {
        const result2 = await utils.imageUploader(req);
        console.log('addGame >> Game image uploader result!', result2);
        if (result2.success === false) {
          return res.json({
            success: false,
            errors: [
              {
                path: 'Game Image',
                type: 'required'
              }
            ]
          });
        }

        if (!iframeURL) {
          const result = await utils.zipUploader(req);
          console.log('addGame >> Game uploader result!', result);
        }

        const gameData = {
          name,
          slug,
          category,
          URL: `${process.env.DOMAIN}/games/${slug}/index.html`,
          image: `${process.env.DOMAIN}${result2.URL}`,
          leaderboard: leaderboard === 'Yes' ? 'Yes' : 'No',
          priority,
          hidden: JSON.parse(hidden) === true ? true : false
        };

        if (iframeURL) {
          gameData.iframeURL = iframeURL;
        }

        const game = await gameModel.addGame(gameData);

        if (game.status === 201) {
          return res.json({
            success: true,
            game: game.game,
            msg: 'Game uploaded!'
          });
        } else {
          return res.json({
            success: false,
            errors: game.err
          });
        }
      } else {
        return res.json({
          success: false,
          errors: [
            {
              path: 'slug',
              type: 'unique'
            }
          ]
        });
      }
    } else {
      if (req.files && !req.files.game_zip) {
        return res.json({
          success: false,
          errors: [
            {
              path: 'GameZip',
              type: 'required'
            }
          ]
        });
      } else if (req.files && !req.files.image) {
        return res.json({
          success: false,
          errors: [
            {
              path: 'GameImage',
              type: 'required'
            }
          ]
        });
      } else {
        return res.json({
          success: false,
          msg: 'One ore more parameter is required'
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    const {
      name,
      slug,
      category,
      leaderboard,
      iframeURL,
      priority,
      hidden
    } = req.body;

    if (gameId) {
      const game = await gameModel.getGameById(gameId, next);
      if (game) {
        const gameData = {};
        if (name) {
          gameData.name = name;
        }

        if (JSON.parse(hidden) === true) {
          gameData.hidden = true;
        } else {
          gameData.hidden = false;
        }

        if (priority) {
          gameData.priority = priority;
        } else {
          gameData.priority = 0;
        }

        if (slug) {
          gameData.slug = slug;
        }

        if (category) {
          gameData.category = category;
        }

        if (leaderboard) {
          gameData.leaderboard = leaderboard === 'Yes' ? 'Yes' : 'No';
        }

        if (iframeURL) {
          gameData.iframeURL = iframeURL;
        } else {
          gameData.iframeURL = '';
        }

        if (req.files && req.files.game_zip) {
          const result = await utils.zipUploader(req);
          console.log('updateGame >> Game uploader result!', result);

          if (result.success === true) {
            gameData.URL = `${process.env.DOMAIN}/games/${slug}/index.html`;
          } else {
            return res.json({
              success: false,
              msg: 'Unable to upload game zip!'
            });
          }
        }

        if (req.files && req.files.image) {
          const result = await utils.imageUploader(req);
          console.log('updateGame >> Image uploader result!', result);

          if (result.success === true) {
            gameData.image = `${process.env.DOMAIN}${result.URL}`;
          }
        }

        const updateResult = await gameModel.updateGame(gameId, gameData);
        if (updateResult) {
          const updatedGame = await gameModel.getGameById(gameId, next);

          return res.json({
            success: true,
            game: updatedGame
          });
        } else {
          return res.json({
            success: false,
            msg: 'Unable to update game!'
          });
        }
      } else {
        return res.json({
          success: false,
          msg: 'Game not found!'
        });
      }
    } else {
      return res.json({
        success: false,
        msg: 'One ore more parameter is required'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    if (gameId) {
      const game = await gameModel.getGameById(gameId, next);
      if (game) {
        const gameSlug = game.URL.split('/games/')[1].split('/index.html')[0];
        await utils.zipRemover(gameSlug);

        await gameModel.deleteGameById(gameId);

        return res.json({
          success: true,
          msg: 'Game deleted!'
        });
      } else {
        return res.json({
          success: false,
          msg: 'Game not found!'
        });
      }
    } else {
      return res.json({
        success: false,
        msg: 'One ore more parameter is required'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getGamesByCategorySlug = async (req, res, next) => {
  try {
    const slug = req.params.categorySlug;
    console.log(slug);

    const skip = req.query.skip || 0;
    const limit = req.query.limit || 100;

    if (slug) {
      const games = await gameModel.getGamesByCategorySlug(
        slug,
        skip,
        limit,
        next
      );

      return res.json({
        success: true,
        games
      });
    } else {
      return res.json({
        success: false,
        msg: 'One ore more parameter is required'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.searchGames = async (req, res, next) => {
  try {
    const searchQuery = req.query.query;

    if (searchQuery) {
      const games = await gameModel.searchGames(searchQuery, next);
      return res.json({
        success: true,
        games
      });
    } else {
      return res.json({
        success: false,
        msg: 'One ore more parameter is required'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getGames = async (req, res, next) => {
  try {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 200;

    const games = await gameModel.getGames(skip, limit, next);
    return res.json({
      success: true,
      data: games
    });
  } catch (err) {
    next(err);
  }
};

exports.getHomeGames = async (req, res, next) => {
  try {
    const categories = await gameCategoryModel.getCategories();

    const skip = req.query.skip || 0;
    const limit = req.query.limit || 8;

    const prArrays = categories.map((category) => {
      return gameModel.getGamesByCategoryId(category._id, skip, limit);
    });

    const games = await Promise.all(prArrays);

    const finalObj = {};

    games.forEach((game) => {
      game.forEach((g) => {
        if (!finalObj[g.category.slug]) {
          finalObj[g.category.slug] = {
            name: g.category.slug,
            games: [g]
          };
        } else {
          finalObj[g.category.slug].games.push(g);
        }
      });
    });

    const finalGamesArray = [];
    for (let i in finalObj) {
      finalGamesArray.push({
        name: finalObj[i].name,
        games: finalObj[i].games
      });
    }

    return res.json({
      success: true,
      data: finalGamesArray
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: []
    });
  }
};

exports.getAdminGames = async (req, res, next) => {
  try {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 200;

    const games = await gameModel.getAdminGames(skip, limit, next);
    return res.json({
      success: true,
      data: games
    });
  } catch (err) {
    next(err);
  }
};
