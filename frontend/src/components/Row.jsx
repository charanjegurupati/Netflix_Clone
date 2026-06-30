import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { IoMdAdd, IoMdPlay } from 'react-icons/io';
import VideoModal from './VideoModal';

const Row = ({ title, movies }) => {
  const [trailerUrl, setTrailerUrl] = useState('');

  const handlePlay = (movie) => {
    if (movie.trailerUrl) {
      setTrailerUrl(movie.trailerUrl);
    } else {
      alert('No trailer available');
    }
  };

  const handleAddToList = async (movie, e) => {
    e.stopPropagation();
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
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => (
          <div key={movie._id || movie.title} className="poster-container" onClick={() => handlePlay(movie)}>
            <img
              className="row-poster"
              src={movie.posterUrl}
              alt={movie.title}
            />
            <p className="poster-title" style={{color: '#fff', fontSize: '14px', marginTop: '5px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '200px'}}>{movie.title}</p>
            <div className="poster-overlay">
              <button className="icon-btn play-btn" onClick={(e) => { e.stopPropagation(); handlePlay(movie); }}>
                <IoMdPlay />
              </button>
              <button className="icon-btn add-btn" onClick={(e) => handleAddToList(movie, e)}>
                <IoMdAdd />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {trailerUrl && <VideoModal trailerUrl={trailerUrl} onClose={() => setTrailerUrl('')} />}
    </div>
  );
};

export default Row;
