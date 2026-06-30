require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';

mongoose.connect(MONGO_URI).then(async () => {
  const movies = await Movie.find();
  const counts = {};
  movies.forEach(m => {
    counts[m.category] = (counts[m.category] || 0) + 1;
  });
  console.log(counts);
  process.exit(0);
});
