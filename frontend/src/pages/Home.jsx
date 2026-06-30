import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Row from '../components/Row';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get('/api/movies');
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const heroMovie = movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;

  return (
    <div className="home">
      <Navbar />
      {heroMovie && <Hero movie={heroMovie} />}
      
      {loading ? (
        <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading Movies...</div>
      ) : (
        <div style={{ paddingBottom: '40px' }}>
          <Row title="Trending Now" movies={movies.filter(m => m.category === 'Trending Now' || m.category === 'Trending')} />
          <Row title="Top Rated" movies={movies.filter(m => m.category === 'Top Rated')} />
          <Row title="Action Movies" movies={movies.filter(m => m.category === 'Action Movies')} />
          <Row title="Sci-Fi & Adventure" movies={movies.filter(m => m.category === 'Sci-Fi & Adventure')} />
          <Row title="Comedy" movies={movies.filter(m => m.category === 'Comedy')} />
          <Row title="Romance" movies={movies.filter(m => m.category === 'Romance')} />
          <Row title="Horror & Thriller" movies={movies.filter(m => m.category === 'Horror & Thriller')} />
          <Row title="Anime" movies={movies.filter(m => m.category === 'Anime')} />
        </div>
      )}
    </div>
  );
};

export default Home;
