const express = require('express');
const {
  createExhibition,
  getAllExhibitions,
  updateExhibition,
  deleteExhibition,
} = require('../controllers/exhibitionController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const validateRequest = require('../middleware/validateRequest');
const {
  exhibitionIdParamValidator,
  createExhibitionValidator,
  updateExhibitionValidator,
} = require('../validators/exhibitionValidator');

const router = express.Router();

// All exhibition routes require a valid token
router.use(verifyToken);

router.post(
  '/',
  authorizeRole('admin'),
  createExhibitionValidator,
  validateRequest,
  createExhibition
);

router.get('/', getAllExhibitions);

router.put(
  '/:id',
  authorizeRole('admin'),
  updateExhibitionValidator,
  validateRequest,
  updateExhibition
);

router.delete(
  '/:id',
  authorizeRole('admin'),
  exhibitionIdParamValidator,
  validateRequest,
  deleteExhibition
);

module.exports = router;
