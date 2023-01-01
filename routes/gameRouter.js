const express = require('express');
const utils = require('../utils/utils');

const router = express.Router();

const gameController = require('../controllers/gameController');

router.get('/', gameController.getGames);

router.get('/home', gameController.getHomeGames);

router.get('/admin', gameController.getAdminGames);

router.get('/search', gameController.searchGames);

router.get('/:slug', gameController.getGameBySlug);

router.post('/', utils.parseMultipartData, gameController.addGame);

router.patch('/:id', utils.parseMultipartData, gameController.updateGame);

router.delete('/:id', gameController.deleteGame);

module.exports = router;
