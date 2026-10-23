const { body, param } = require('express-validator');

const exhibitionIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Exhibition ID format.'),
];

const createExhibitionValidator = [
  body('exhibitionName')
    .trim()
    .notEmpty()
    .withMessage('Exhibition name is required.')
    .isLength({ min: 2, max: 200 })
    .withMessage('Exhibition name must be between 2 and 200 characters.'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required.')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date string.'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required.')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date string.')
    .custom((endDate, { req }) => {
      if (req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after the start date.');
      }
      return true;
    }),
  body('artworkIds')
    .optional()
    .isArray()
    .withMessage('artworkIds must be an array of IDs.'),
  body('artworkIds.*')
    .optional()
    .isMongoId()
    .withMessage('Each artwork ID must be a valid MongoDB ID format.'),
];

const updateExhibitionValidator = [
  ...exhibitionIdParamValidator,
  body('exhibitionName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Exhibition name must be between 2 and 200 characters.'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date string.'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date string.')
    .custom((endDate, { req }) => {
      if (req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after the start date.');
      }
      return true;
    }),
  body('artworkIds')
    .optional()
    .isArray()
    .withMessage('artworkIds must be an array of IDs.'),
  body('artworkIds.*')
    .optional()
    .isMongoId()
    .withMessage('Each artwork ID must be a valid MongoDB ID format.'),
];

module.exports = {
  exhibitionIdParamValidator,
  createExhibitionValidator,
  updateExhibitionValidator,
};
