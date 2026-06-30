const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

// Get user's favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add movie to favorites
router.post('/favorites/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.movieId)) {
      user.favorites.push(req.params.movieId);
      await user.save();
    }
    const populatedUser = await User.findById(req.user.id).populate('favorites');
    res.json(populatedUser.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove movie from favorites
router.delete('/favorites/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.movieId);
    await user.save();
    const populatedUser = await User.findById(req.user.id).populate('favorites');
    res.json(populatedUser.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
