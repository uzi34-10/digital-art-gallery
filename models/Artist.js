const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    artistName: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
      minlength: [2, 'Artist name must be at least 2 characters'],
      maxlength: [100, 'Artist name cannot exceed 100 characters'],
      index: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      maxlength: [100, 'Specialization cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artist', artistSchema);
