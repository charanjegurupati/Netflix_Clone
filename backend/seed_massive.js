require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('./models/Movie');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';

const cinematicBanners = [
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1935&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'
];

const moviesData = {
  "Trending Now": [
    "Stranger Things", "Squid Game", "Wednesday", "ONE PIECE (Live Action)", "The Night Agent", "Ginny & Georgia", "Avatar: The Last Airbender", "The Lincoln Lawyer", "Virgin River", "Bloodhounds", "The Diplomat", "Beauty in Black"
  ],
  "Top Rated": [
    "Breaking Bad", "Peaky Blinders", "Dark", "Money Heist", "Narcos", "Ozark", "Black Mirror", "Mindhunter", "Better Call Saul", "The Crown", "Alice in Borderland", "Lupin", "Arcane", "Blue Eye Samurai", "Bodyguard", "House of Cards"
  ],
  "Action Movies": [
    "Extraction", "Extraction 2", "The Gray Man", "Red Notice", "The Mother", "Back in Action", "Outside the Wire", "The Old Guard", "Triple Frontier", "6 Underground", "The Union", "Carry-On", "Rebel Ridge", "Spider-Man: Into the Spider-Verse", "Wrath of Man"
  ],
  "Sci-Fi & Adventure": [
    "Interstellar", "Inception", "The Matrix", "Don't Look Up", "The Adam Project", "Atlas", "Damsel", "Code 8", "Mowgli: Legend of the Jungle"
  ],
  "Comedy": [
    "The Office (US)", "Brooklyn Nine-Nine", "Young Sheldon", "Friends", "Sex Education", "Never Have I Ever", "Murder Mystery", "Murder Mystery 2", "The Wrong Missy", "We Have a Ghost"
  ],
  "Romance": [
    "Bridgerton", "Purple Hearts", "Through My Window", "The Kissing Booth", "To All the Boys I've Loved Before", "Love at First Sight", "XO, Kitty", "Heartstopper", "Love and Gelato", "Along for the Ride"
  ],
  "Horror & Thriller": [
    "Bird Box", "Gerald's Game", "Fear Street Trilogy", "His House", "The Platform", "The Call", "Midnight Mass", "Archive 81", "The Haunting of Hill House", "The Haunting of Bly Manor"
  ],
  "Anime": [
    "Demon Slayer", "Jujutsu Kaisen", "Death Note", "Cyberpunk: Edgerunners", "Castlevania", "Dandadan", "Baki Hanma", "Vinland Saga"
  ]
};

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

const seedMassive = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for massive seeding...');

    for (const [category, titles] of Object.entries(moviesData)) {
      for (const title of titles) {
        // Check if already exists
        const existing = await Movie.findOne({ title });
        if (existing) {
          console.log(`Skipping ${title} (Already exists)`);
          continue;
        }

        console.log(`Fetching data for: ${title}`);
        const itunesData = await fetchItunesData(title, category);
        
        const newMovie = new Movie({
          title,
          description: itunesData ? itunesData.description : `Watch ${title} on Netflix!`,
          posterUrl: itunesData ? itunesData.posterUrl : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop',
          bannerUrl: cinematicBanners[Math.floor(Math.random() * cinematicBanners.length)],
          category,
          trailerUrl: '', // Leaving empty so it doesn't crash player
          rating: (Math.random() * (9.5 - 7.0) + 7.0).toFixed(1)
        });

        await newMovie.save();
        console.log(`Saved ${title}!`);
      }
    }

    console.log('Massive seed complete!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMassive();
