require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';

const trailers = {
  "Stranger Things": "https://youtu.be/b9EkMc79ZSU",
  "Wednesday": "https://youtu.be/Di310WS8zLk",
  "Squid Game": "https://youtu.be/oqxAJKy0ii4",
  "ONE PIECE (Live Action)": "https://youtu.be/Ades3pQbeh8",
  "The Night Agent": "https://youtu.be/YDbnY9Obsfs",
  "Avatar: The Last Airbender": "https://youtu.be/ByAn8DF8Ykk", // Adjusted title to match DB ("Avatar: The Last Airbender (Netflix)" is likely saved as "Avatar: The Last Airbender")
  "Money Heist": "https://youtu.be/_InqQJRqGW4",
  "Dark": "https://youtu.be/ESEUoa-mz2c",
  "Ozark": "https://youtu.be/5hAXVqrljbs",
  "Narcos": "https://youtu.be/xl8zdCY-abw",
  "Lupin": "https://youtu.be/ga0iTWXCGa0",
  "Black Mirror": "https://youtu.be/jDiYGjp5iFg",
  "Extraction": "https://youtu.be/L6P3nI6VnlY",
  "Extraction 2": "https://youtu.be/Y274jZs5s7s",
  "Red Notice": "https://youtu.be/Pj0wz7zu3Ms",
  "The Gray Man": "https://youtu.be/BmllggGO4pM",
  "The Old Guard": "https://youtu.be/aK-X2d0lJ_s",
  "The Mother": "https://youtu.be/8BFdFeOS3oM",
  "Rebel Ridge": "https://youtu.be/gF3gZicntIw",
  "Carry-On": "https://youtu.be/KS0XacjMmOc"
};

const updateTrailers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB to update trailers...');

    for (const [title, url] of Object.entries(trailers)) {
      // Standardize to watch?v= format just in case
      const videoId = url.split('/').pop();
      const standardUrl = `https://www.youtube.com/watch?v=${videoId}`;

      const movie = await Movie.findOneAndUpdate(
        { title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') }, 
        { trailerUrl: standardUrl },
        { new: true }
      );
      if (movie) {
        console.log(`Successfully updated trailer for ${movie.title}`);
      } else {
        console.log(`Could not find movie matching: ${title}`);
      }
    }

    console.log('Trailer update complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateTrailers();
