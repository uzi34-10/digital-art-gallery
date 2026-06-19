const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const Category = require('../models/Category');
const Artist = require('../models/Artist');

const createArtwork = async (req, res, next) => {
  try {
    const { title, description, price, category, artistId } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      return next(error);
    }

    const artistExists = await Artist.findById(artistId);
    if (!artistExists) {
      const error = new Error('Artist not found.');
      error.statusCode = 404;
      return next(error);
    }

    const artwork = await Artwork.create({
      title,
      description,
      price,
      category,
      artistId,
    });

    const populatedArtwork = await Artwork.findById(artwork._id)
      .populate('artistId', 'artistName specialization')
      .populate('category', 'categoryName description');

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully.',
      data: { artwork: populatedArtwork },
    });
  } catch (err) {
    next(err);
  }
};

const getAllArtworks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        filter.category = new mongoose.Types.ObjectId(req.query.category);
      }
    }

    const total = await Artwork.countDocuments(filter);
    const artworks = await Artwork.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('artistId', 'artistName specialization')
      .populate('category', 'categoryName');

    res.status(200).json({
      success: true,
      message: 'Artworks retrieved successfully.',
      data: {
        artworks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getArtworkById = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artistId')
      .populate('category');

    if (!artwork) {
      const error = new Error('Artwork not found.');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Artwork retrieved successfully.',
      data: { artwork },
    });
  } catch (err) {
    next(err);
  }
};

const updateArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      const error = new Error('Artwork not found.');
      error.statusCode = 404;
      return next(error);
    }

    if (req.user.role === 'artist') {
      const artist = await Artist.findOne({ userId: req.user.id });
      if (!artist || artwork.artistId.toString() !== artist._id.toString()) {
        const error = new Error('Access denied. You can only update your own artworks.');
        error.statusCode = 403;
        return next(error);
      }
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        const error = new Error('Category not found.');
        error.statusCode = 404;
        return next(error);
      }
    }

    const allowedFields = ['title', 'description', 'price', 'category'];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('artistId', 'artistName specialization')
      .populate('category', 'categoryName description');

    res.status(200).json({
      success: true,
      message: 'Artwork updated successfully.',
      data: { artwork: updatedArtwork },
    });
  } catch (err) {
    next(err);
  }
};

const deleteArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      const error = new Error('Artwork not found.');
      error.statusCode = 404;
      return next(error);
    }

    await Artwork.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully.',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArtwork,
  getAllArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
};
