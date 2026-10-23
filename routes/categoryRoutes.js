const express = require('express');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const validateRequest = require('../middleware/validateRequest');
const {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/categoryValidator');

const router = express.Router();

// All category routes require a valid token
router.use(verifyToken);

router.post(
  '/',
  authorizeRole('admin'),
  createCategoryValidator,
  validateRequest,
  createCategory
);

router.get('/', getAllCategories);

router.put(
  '/:id',
  authorizeRole('admin'),
  updateCategoryValidator,
  validateRequest,
  updateCategory
);

router.delete(
  '/:id',
  authorizeRole('admin'),
  categoryIdParamValidator,
  validateRequest,
  deleteCategory
);

module.exports = router;
