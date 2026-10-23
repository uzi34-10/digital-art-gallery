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
const validateRequest = require('../middleware/validateRequest');
const {
  artworkIdParamValidator,
  createArtworkValidator,
  updateArtworkValidator,
  artworkQueryValidator,
} = require('../validators/artworkValidator');

const router = express.Router();

// All artwork routes require a valid token
router.use(verifyToken);

router.post(
  '/',
  authorizeRole('admin', 'artist'),
  createArtworkValidator,
  validateRequest,
  createArtwork
);

router.get(
  '/',
  artworkQueryValidator,
  validateRequest,
  getAllArtworks
);

router.get(
  '/:id',
  artworkIdParamValidator,
  validateRequest,
  getArtworkById
);

router.put(
  '/:id',
  authorizeRole('admin', 'artist'),
  updateArtworkValidator,
  validateRequest,
  updateArtwork
);

router.delete(
  '/:id',
  authorizeRole('admin'),
  artworkIdParamValidator,
  validateRequest,
  deleteArtwork
);

module.exports = router;
