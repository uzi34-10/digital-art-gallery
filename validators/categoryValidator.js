const { body, param } = require('express-validator');

const categoryIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Category ID format.'),
];

const createCategoryValidator = [
  body('categoryName')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.'),
];

const updateCategoryValidator = [
  ...categoryIdParamValidator,
  body('categoryName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.'),
];

module.exports = {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
};
