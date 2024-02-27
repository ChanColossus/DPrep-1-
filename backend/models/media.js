const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    mname: {
      type: String,
      required: [true, 'Please enter media topic'],
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
      mvideo: [
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
  
  module.exports = mongoose.model('Media', mediaSchema);