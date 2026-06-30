const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to protect and check admin
const adminProtect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    
    if (user && user.email === 'charanjegurupati@gmail.com') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET movie by id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET movies by category
router.get('/category/:category', async (req, res) => {
  try {
    const movies = await Movie.find({ category: req.params.category });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new movie (Admin only)
router.post('/', adminProtect, async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a movie (Admin only)
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
