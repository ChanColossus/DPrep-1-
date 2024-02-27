const mongoose = require('mongoose');

const igSchema = new mongoose.Schema({
    gname: {
      type: String,
      required: [true, 'Please enter infographics topic'],
      trim: true,
      maxLength: [100, 'Topic name cannot exceed 100 characters'],
    },
    disasterProne: [
        {
          name: {
            type: String,
            required: [true, 'Please enter disaster name'],
          },
        },
      ],
    gimages: [
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
  
  module.exports = mongoose.model('Ig', igSchema);