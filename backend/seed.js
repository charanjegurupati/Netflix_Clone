const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const mockMovies = [
  // Trending Now
  {
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    category: 'Trending Now',
    rating: 8.6
  },
  {
    title: 'The Witcher',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfV0GlqHrcdSc8.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg',
    category: 'Trending Now',
    rating: 8.2
  },
  {
    title: 'Squid Game',
    description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/oaGvjB0CWkP4DlHKfPnZQALTnki.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
    category: 'Trending Now',
    rating: 8.0
  },
  {
    title: 'The Boys',
    description: 'A group of vigilantes known informally as “The Boys” set out to take down corrupt superheroes with no more than blue-collar grit and a willingness to fight dirty.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/n6vVs6z8obNpmlEdVgZE3pUSFOu.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=M1bhOaLV4FU',
    category: 'Trending Now',
    rating: 8.7
  },

  // Top Rated
  {
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    category: 'Top Rated',
    rating: 9.5
  },
  {
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for thousands of years.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=KPLWWIfvG6f',
    category: 'Top Rated',
    rating: 9.3
  },
  {
    title: 'Peaky Blinders',
    description: 'A gangster family epic set in 1919 Birmingham, England; centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_FMjpg_UX1000_.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/cT8kQ02s2zXf22I8nQer8xWcI0B.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=oVzVdvGIC7U',
    category: 'Top Rated',
    rating: 8.8
  },
  {
    title: 'The Office',
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/A5Bxa7h02FhA0XW2sU4k0g2LntG.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=cRmOgL10s7s',
    category: 'Top Rated',
    rating: 8.9
  },

  // Action Movies
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    category: 'Action Movies',
    rating: 8.8
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    category: 'Action Movies',
    rating: 9.0
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    category: 'Action Movies',
    rating: 8.4
  },
  {
    title: 'Spider-Man: No Way Home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjBi00ZTEzLWE5YTItYjgyYmUwZGRjYWFiXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UX1000_.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmZP0sIfL7.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    category: 'Action Movies',
    rating: 8.0
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY0XZ0Ed.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    category: 'Action Movies',
    rating: 8.6
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xXq1rE8Fm8qTqM1lA8U7a6Q2L8M.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=m8e-FF8MsqU',
    category: 'Action Movies',
    rating: 8.7
  }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing data
    await Movie.deleteMany();
    console.log('Cleared existing movies');

    // Insert mock data
    await Movie.insertMany(mockMovies);
    console.log('Successfully seeded movies');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
