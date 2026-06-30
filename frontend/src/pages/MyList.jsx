import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import VideoModal from '../components/VideoModal';

const MyList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites', error);
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleMovieClick = (movie) => {
    if (movie.trailerUrl) {
      setTrailerUrl(movie.trailerUrl);
    } else {
      alert('No trailer available');
    }
  };

  return (
    <div className="home" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>My List</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : movies.length === 0 ? (
          <p>Your list is empty. Add movies to watch later!</p>
        ) : (
          <div className="list-grid">
            {movies.map((movie) => (
              <img
                key={movie._id}
                className="row-poster"
                src={movie.posterUrl}
                alt={movie.title}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        )}
      </div>
      
      {trailerUrl && <VideoModal trailerUrl={trailerUrl} onClose={() => setTrailerUrl('')} />}
    </div>
  );
};

export default MyList;
