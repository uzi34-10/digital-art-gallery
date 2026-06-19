const Category = require('../models/Category');

const createCategory = async (req, res, next) => {
  try {
    const { categoryName, description } = req.body;

    const existingCategory = await Category.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') },
    });

    if (existingCategory) {
      const error = new Error(`A category named '${categoryName}' already exists.`);
      error.statusCode = 409;
      return next(error);
    }

    const category = await Category.create({ categoryName, description });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully.',
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      return next(error);
    }

    const { categoryName, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: { category: updatedCategory },
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      return next(error);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
