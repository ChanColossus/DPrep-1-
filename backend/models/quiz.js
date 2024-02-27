const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    qname: {
      type: String,
      required: [true, 'Please enter quiz name'],
      trim: true,
      unique: true,
      maxLength: [100, 'Barangay name cannot exceed 100 characters'],
    },
    qtopic: {
      type: String,
      required: [true, 'Please enter quiz topic'],
    },
    disasterProne: [
        {
          name: {
            type: String,
            required: [true, 'Please enter disaster name'],
          },
        },
      ],
      QandA: [
        {
          question: {
            type: String,
            required: [true, 'Please enter question'],
          },
          answer: {
            type: String,
            required: [true, 'Please enter answer'],
          },
        },
      ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Quiz', quizSchema);