require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('./models/Movie');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';
const TMDB_API_KEY = 'd9ea5cdfbd2375a2f046021d81676cc7';

const fetchTmdbTrailer = async (title) => {
  try {
    // 1. Search for the title
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
    if (searchRes.data.results && searchRes.data.results.length > 0) {
      // Prioritize exact or close matches
      let item = searchRes.data.results.find(r => r.media_type === 'movie' || r.media_type === 'tv');
      if (!item) return null;

      // 2. Fetch the videos for this item
      const videoRes = await axios.get(`https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${TMDB_API_KEY}`);
      if (videoRes.data.results && videoRes.data.results.length > 0) {
        // Find a YouTube Trailer
        const trailer = videoRes.data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
        if (trailer) {
          return `https://www.youtube.com/watch?v=${trailer.key}`;
        }
        // Fallback to any YouTube video if Trailer not found
        const anyVideo = videoRes.data.results.find(v => v.site === 'YouTube');
        if (anyVideo) {
          return `https://www.youtube.com/watch?v=${anyVideo.key}`;
        }
      }
    }
  } catch (err) {
    console.error(`Error fetching trailer for ${title}: ${err.message}`);
  }
  return null;
};

const updateAllTrailers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Finding movies missing valid trailers...');

    // Find all movies that don't have a trailerUrl or have an invalid one
    const movies = await Movie.find({ 
      $or: [
        { trailerUrl: { $exists: false } },
        { trailerUrl: null },
        { trailerUrl: "" },
        { trailerUrl: { $not: /youtube\.com\/watch/ } } // Also catches youtu.be if any were missed
      ] 
    });

    console.log(`Found ${movies.length} movies that need trailers. Fetching from TMDB...`);

    let count = 0;
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      console.log(`[${i+1}/${movies.length}] Searching trailer for: ${movie.title}`);
      
      const trailerUrl = await fetchTmdbTrailer(movie.title);
      if (trailerUrl) {
        movie.trailerUrl = trailerUrl;
        await movie.save();
        console.log(`   -> Found trailer: ${trailerUrl}`);
        count++;
      } else {
        console.log(`   -> No trailer found for ${movie.title}.`);
      }
    }

    console.log(`Finished! Successfully added trailers for ${count}/${movies.length} movies.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateAllTrailers();
