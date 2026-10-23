const { body, param, query } = require('express-validator');

const artworkIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Artwork ID format.'),
];

const createArtworkValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters.'),
  body('price')
    .notEmpty()
    .withMessage('Price is required.')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number.'),
  body('category')
    .notEmpty()
    .withMessage('Category ID is required.')
    .isMongoId()
    .withMessage('Invalid Category ID format.'),
  body('artistId')
    .notEmpty()
    .withMessage('Artist ID is required.')
    .isMongoId()
    .withMessage('Invalid Artist ID format.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters.'),
];

const updateArtworkValidator = [
  ...artworkIdParamValidator,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters.'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number.'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid Category ID format.'),
  body('artistId')
    .optional()
    .isMongoId()
    .withMessage('Invalid Artist ID format.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters.'),
];

const artworkQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer greater than 0.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100.'),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Category filter must be a valid MongoDB ID.'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search term must be a valid string.'),
];

module.exports = {
  artworkIdParamValidator,
  createArtworkValidator,
  updateArtworkValidator,
  artworkQueryValidator,
};
