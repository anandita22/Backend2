const express = require('express');

const router = express.Router();

const gameCategoryController = require('../controllers/gameCategoryController');
const gamyController = require('../controllers/gameController'); 

router.post('/', gameCategoryController.addCategory);

router.get('/', gameCategoryController.getCategories);

router.delete('/:id', gameCategoryController.deleteCategory);

router.get('/:categorySlug', gamyController.getGamesByCategorySlug);

module.exports = router;
