import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import VideoModal from './VideoModal';

const Hero = ({ movie }) => {
  const [trailerUrl, setTrailerUrl] = useState('');

  const handlePlay = () => {
    if (movie.trailerUrl) {
      setTrailerUrl(movie.trailerUrl);
    } else {
      alert('No trailer available');
    }
  };

  const handleAddToList = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(`/api/users/favorites/${movie._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${movie.title} added to My List!`);
    } catch (err) {
      alert('Failed to add to list');
    }
  };

  return (
    <>
      <header className="hero" style={{ backgroundImage: `url('${movie.bannerUrl}')` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{movie.title}</h1>
          <div className="hero-buttons">
            <button className="btn btn-play" onClick={handlePlay}>Play</button>
            <button className="btn btn-more" onClick={handleAddToList}>Add to List</button>
          </div>
          <h1 className="hero-description">
            {movie.description}
          </h1>
        </div>
      </header>
      {trailerUrl && <VideoModal trailerUrl={trailerUrl} onClose={() => setTrailerUrl('')} />}
    </>
  );
};

export default Hero;
