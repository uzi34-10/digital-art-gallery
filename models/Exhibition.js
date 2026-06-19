const mongoose = require('mongoose');

const exhibitionSchema = new mongoose.Schema(
  {
    exhibitionName: {
      type: String,
      required: [true, 'Exhibition name is required'],
      trim: true,
      minlength: [2, 'Exhibition name must be at least 2 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    artworkIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Artwork',
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exhibition', exhibitionSchema);
