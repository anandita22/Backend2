const gameCategoryModel = require('../models/gameCategoryModel');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await gameCategoryModel.getCategories(next);

    return res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    const name = req.body.name;
    const slug = req.body.slug;

    if (name && slug) {
      const category = await gameCategoryModel.addCategory(name, slug, next);
      if (category.status === 201) {
        return res.json({
          success: true,
          data: category.category
        });
      } else {
        return res.json({
          success: false,
          data: null,
          errors: category.err
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

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryID = req.params.id;

    if (categoryID) {
      await gameCategoryModel.deleteCategory(categoryID, next);
      return res.json({
        success: true,
        msg: 'Category deleted!'
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