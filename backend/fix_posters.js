require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('./models/Movie');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';

const PLACEHOLDER_URL = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';

const delay = ms => new Promise(res => setTimeout(res, ms));

const fetchItunesData = async (title, category) => {
  try {
    const isTv = ["Trending Now", "Top Rated", "Anime"].includes(category);
    const entity = isTv ? "tvSeason" : "movie";
    const res = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=${entity}&limit=1`);
    if (res.data.results && res.data.results.length > 0) {
      const data = res.data.results[0];
      let posterUrl = data.artworkUrl100.replace('100x100bb', '600x600bb');
      let description = data.longDescription || data.shortDescription || `An amazing ${isTv ? 'show' : 'movie'} that you must watch!`;
      return { posterUrl, description };
    }
  } catch (err) {
    console.error(`Error fetching data for ${title}: ${err.message}`);
  }
  return null;
};

const fixPosters = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Finding movies with placeholder posters...');

    const moviesToFix = await Movie.find({ posterUrl: PLACEHOLDER_URL });
    console.log(`Found ${moviesToFix.length} movies to fix.`);

    for (let i = 0; i < moviesToFix.length; i++) {
      const movie = moviesToFix[i];
      console.log(`[${i+1}/${moviesToFix.length}] Re-fetching: ${movie.title}`);
      
      const itunesData = await fetchItunesData(movie.title, movie.category);
      
      if (itunesData) {
        movie.posterUrl = itunesData.posterUrl;
        movie.description = itunesData.description;
        await movie.save();
        console.log(`   -> Successfully fixed poster for ${movie.title}`);
      } else {
        console.log(`   -> Could not find iTunes data for ${movie.title}`);
      }
      
      // Wait 1.5 seconds to avoid rate limiting
      await delay(1500);
    }

    console.log('Finished fixing posters!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixPosters();
