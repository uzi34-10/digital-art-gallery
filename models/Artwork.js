const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Artist ID is required'],
      index: true,
    },
  },
  { timestamps: true }
);

// Production Indexes for optimized querying and sorting
artworkSchema.index({ title: 1 });
artworkSchema.index({ category: 1, createdAt: -1 });
artworkSchema.index({ artistId: 1, createdAt: -1 });

module.exports = mongoose.model('Artwork', artworkSchema);
