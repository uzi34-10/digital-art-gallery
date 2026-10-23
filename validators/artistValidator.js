const { body, param } = require('express-validator');

const artistIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Artist ID format.'),
];

const createArtistValidator = [
  body('artistName')
    .trim()
    .notEmpty()
    .withMessage('Artist name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Artist name must be between 2 and 100 characters.'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required.')
    .isLength({ max: 100 })
    .withMessage('Specialization cannot exceed 100 characters.'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters.'),
];

const updateArtistValidator = [
  ...artistIdParamValidator,
  body('artistName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Artist name must be between 2 and 100 characters.'),
  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization cannot exceed 100 characters.'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters.'),
];

module.exports = {
  artistIdParamValidator,
  createArtistValidator,
  updateArtistValidator,
};
