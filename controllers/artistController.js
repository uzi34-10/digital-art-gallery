const Artist = require('../models/Artist');

const createArtist = async (req, res, next) => {
  try {
    const { artistName, specialization, bio } = req.body;

    const existingArtist = await Artist.findOne({ userId: req.user.id });
    if (existingArtist) {
      const error = new Error('An artist profile already exists for this user.');
      error.statusCode = 409;
      return next(error);
    }

    const artist = await Artist.create({
      artistName,
      specialization,
      bio,
      userId: req.user.id,
    });

    const populatedArtist = await Artist.findById(artist._id).populate(
      'userId',
      'name email role'
    );

    res.status(201).json({
      success: true,
      message: 'Artist profile created successfully.',
      data: { artist: populatedArtist },
    });
  } catch (err) {
    next(err);
  }
};

const getAllArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find().populate('userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Artists retrieved successfully.',
      data: { artists },
    });
  } catch (err) {
    next(err);
  }
};

const getArtistById = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id).populate(
      'userId',
      'name email role'
    );

    if (!artist) {
      const error = new Error('Artist not found.');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Artist retrieved successfully.',
      data: { artist },
    });
  } catch (err) {
    next(err);
  }
};

const updateArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      const error = new Error('Artist not found.');
      error.statusCode = 404;
      return next(error);
    }

    if (req.user.role === 'artist') {
      if (artist.userId.toString() !== req.user.id) {
        const error = new Error('Access denied. You can only update your own artist profile.');
        error.statusCode = 403;
        return next(error);
      }
    }

    const { artistName, specialization, bio } = req.body;

    const updatedArtist = await Artist.findByIdAndUpdate(
      req.params.id,
      { artistName, specialization, bio },
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Artist profile updated successfully.',
      data: { artist: updatedArtist },
    });
  } catch (err) {
    next(err);
  }
};

const deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      const error = new Error('Artist not found.');
      error.statusCode = 404;
      return next(error);
    }

    await Artist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Artist profile deleted successfully.',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
