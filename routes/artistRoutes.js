const express = require('express');
const {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
} = require('../controllers/artistController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const validateRequest = require('../middleware/validateRequest');
const {
  artistIdParamValidator,
  createArtistValidator,
  updateArtistValidator,
} = require('../validators/artistValidator');

const router = express.Router();

// All artist routes require a valid token
router.use(verifyToken);

router.post(
  '/',
  authorizeRole('admin', 'artist'),
  createArtistValidator,
  validateRequest,
  createArtist
);

router.get('/', getAllArtists);

router.get(
  '/:id',
  artistIdParamValidator,
  validateRequest,
  getArtistById
);

router.put(
  '/:id',
  authorizeRole('admin', 'artist'),
  updateArtistValidator,
  validateRequest,
  updateArtist
);

router.delete(
  '/:id',
  authorizeRole('admin'),
  artistIdParamValidator,
  validateRequest,
  deleteArtist
);

module.exports = router;
