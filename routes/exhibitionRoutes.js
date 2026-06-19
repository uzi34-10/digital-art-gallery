const express = require('express');
const {
  createExhibition,
  getAllExhibitions,
  updateExhibition,
  deleteExhibition,
} = require('../controllers/exhibitionController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

router.use(verifyToken);

router.post('/', authorizeRole('admin'), createExhibition);
router.get('/', getAllExhibitions);
router.put('/:id', authorizeRole('admin'), updateExhibition);
router.delete('/:id', authorizeRole('admin'), deleteExhibition);

module.exports = router;
