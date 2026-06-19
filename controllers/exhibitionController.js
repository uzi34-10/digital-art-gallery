const Exhibition = require('../models/Exhibition');
const Artwork = require('../models/Artwork');

const validateArtworkIds = async (artworkIds) => {
  if (!artworkIds || artworkIds.length === 0) return;

  const foundArtworks = await Artwork.find({ _id: { $in: artworkIds } }).select('_id');
  const foundIds = foundArtworks.map((a) => a._id.toString());

  const invalidIds = artworkIds.filter((id) => !foundIds.includes(id.toString()));
  if (invalidIds.length > 0) {
    const error = new Error(
      `The following artwork IDs do not exist: ${invalidIds.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }
};

const createExhibition = async (req, res, next) => {
  try {
    const { exhibitionName, startDate, endDate, artworkIds } = req.body;

    await validateArtworkIds(artworkIds);

    const exhibition = await Exhibition.create({
      exhibitionName,
      startDate,
      endDate,
      artworkIds: artworkIds || [],
    });

    const populatedExhibition = await Exhibition.findById(exhibition._id).populate(
      {
        path: 'artworkIds',
        select: 'title price artistId',
        populate: { path: 'artistId', select: 'artistName' },
      }
    );

    res.status(201).json({
      success: true,
      message: 'Exhibition created successfully.',
      data: { exhibition: populatedExhibition },
    });
  } catch (err) {
    next(err);
  }
};

const getAllExhibitions = async (req, res, next) => {
  try {
    const exhibitions = await Exhibition.find().populate({
      path: 'artworkIds',
      select: 'title price artistId',
      populate: { path: 'artistId', select: 'artistName' },
    });

    res.status(200).json({
      success: true,
      message: 'Exhibitions retrieved successfully.',
      data: { exhibitions },
    });
  } catch (err) {
    next(err);
  }
};

const updateExhibition = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);

    if (!exhibition) {
      const error = new Error('Exhibition not found.');
      error.statusCode = 404;
      return next(error);
    }

    const { artworkIds } = req.body;

    if (artworkIds !== undefined) {
      await validateArtworkIds(artworkIds);
    }

    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'artworkIds',
      select: 'title price artistId',
      populate: { path: 'artistId', select: 'artistName' },
    });

    res.status(200).json({
      success: true,
      message: 'Exhibition updated successfully.',
      data: { exhibition: updatedExhibition },
    });
  } catch (err) {
    next(err);
  }
};

const deleteExhibition = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);

    if (!exhibition) {
      const error = new Error('Exhibition not found.');
      error.statusCode = 404;
      return next(error);
    }

    await Exhibition.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Exhibition deleted successfully.',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createExhibition,
  getAllExhibitions,
  updateExhibition,
  deleteExhibition,
};
