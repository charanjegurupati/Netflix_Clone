const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  posterUrl: {
    type: String,
  },
  bannerUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  trailerUrl: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Movie', movieSchema);
