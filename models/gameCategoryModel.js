const GameCategory = require('../db/schemas/gameCategorySchema');

const utils = require('../utils/utils');

exports.getCategories = async () => {
  try {
    return await GameCategory.find({}, { __v: 0 });
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.addCategory = async (name, slug, next) => {
  try {
    const category = await GameCategory.create({
      name,
      slug: slug.toLowerCase()
    });

    return {
      status: 201,
      category
    };
  } catch (err) {
    const errors = await utils.errorParser(err);
    console.log('addCategory >> Errors >>', errors);
    return {
      status: 500,
      err: errors
    };
  }
};

exports.deleteCategory = async (categoryID, next) => {
  try {
    return await GameCategory.deleteOne({ _id: categoryID });
  } catch (err) {
    next(err);
  }
};
