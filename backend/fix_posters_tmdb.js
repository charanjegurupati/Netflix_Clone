require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('./models/Movie');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';
const TMDB_API_KEY = 'd9ea5cdfbd2375a2f046021d81676cc7';
const PLACEHOLDER_URL = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const fetchTmdbData = async (title) => {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
    if (res.data.results && res.data.results.length > 0) {
      // Find the first result with a poster path
      const validResult = res.data.results.find(r => r.poster_path);
      if (validResult) {
        let posterUrl = `${BASE_IMAGE_URL}${validResult.poster_path}`;
        let description = validResult.overview || 'An amazing title you must watch!';
        return { posterUrl, description };
      }
    }
  } catch (err) {
    console.error(`Error fetching TMDB data for ${title}: ${err.message}`);
  }
  return null;
};

const fixPostersTmdb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Finding movies with placeholder posters...');

    const moviesToFix = await Movie.find({ posterUrl: PLACEHOLDER_URL });
    console.log(`Found ${moviesToFix.length} movies to fix using TMDB...`);

    let fixedCount = 0;
    for (let i = 0; i < moviesToFix.length; i++) {
      const movie = moviesToFix[i];
      console.log(`[${i+1}/${moviesToFix.length}] TMDB fetching: ${movie.title}`);
      
      const tmdbData = await fetchTmdbData(movie.title);
      
      if (tmdbData) {
        movie.posterUrl = tmdbData.posterUrl;
        movie.description = tmdbData.description;
        await movie.save();
        console.log(`   -> Successfully fixed poster for ${movie.title}`);
        fixedCount++;
      } else {
        console.log(`   -> Could not find TMDB data for ${movie.title}`);
      }
    }

    console.log(`Finished fixing ${fixedCount}/${moviesToFix.length} posters!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixPostersTmdb();
