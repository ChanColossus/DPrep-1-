const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    bname: {
      type: String,
      required: [true, 'Please enter barangay name'],
      trim: true,
      unique: true,
      maxLength: [100, 'Barangay name cannot exceed 100 characters'],
    },
    bdescription: {
      type: String,
      required: [true, 'Please enter barangay description'],
    },
    disasterProne: [
        {
          name: {
            type: String,
            required: [true, 'Please enter disaster name'],
          },
        },
      ],
    bimages: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Area', areaSchema);