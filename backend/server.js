const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*'
}));

// Basic Route
app.get('/', (req, res) => {
  res.send('Netflix Clone API is running');
});

// API Routes
app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Database connection (stubbed for now)
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
