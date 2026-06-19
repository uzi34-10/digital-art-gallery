const express = require('express');
const {
  createArtwork,
  getAllArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
} = require('../controllers/artworkController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

router.use(verifyToken);

router.post('/', authorizeRole('admin', 'artist'), createArtwork);
router.get('/', getAllArtworks);
router.get('/:id', getArtworkById);
router.put('/:id', authorizeRole('admin', 'artist'), updateArtwork);
router.delete('/:id', authorizeRole('admin'), deleteArtwork);

module.exports = router;
