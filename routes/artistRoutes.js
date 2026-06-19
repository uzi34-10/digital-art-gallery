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

const router = express.Router();

router.use(verifyToken);

router.post('/', authorizeRole('admin', 'artist'), createArtist);
router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.put('/:id', authorizeRole('admin', 'artist'), updateArtist);
router.delete('/:id', authorizeRole('admin'), deleteArtist);

module.exports = router;
