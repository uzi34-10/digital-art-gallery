const express = require('express');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

router.use(verifyToken);

router.post('/', authorizeRole('admin'), createCategory);
router.get('/', getAllCategories);
router.put('/:id', authorizeRole('admin'), updateCategory);
router.delete('/:id', authorizeRole('admin'), deleteCategory);

module.exports = router;
