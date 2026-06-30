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

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>;

  // Split movies by category for the rows
  const trendingMovies = movies.filter(m => m.category === 'Trending Now');
  const topRatedMovies = movies.filter(m => m.category === 'Top Rated');
  const actionMovies = movies.filter(m => m.category === 'Action Movies');

  // Pick a random movie for the hero banner
  const heroMovie = movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;

  return (
    <div className="home">
      <Navbar />
      {heroMovie && <Hero movie={heroMovie} />}
      <Row title="Trending Now" movies={trendingMovies.length > 0 ? trendingMovies : movies} />
      <Row title="Top Rated" movies={topRatedMovies.length > 0 ? topRatedMovies : movies} />
      <Row title="Action Movies" movies={actionMovies.length > 0 ? actionMovies : movies} />
    </div>
  );
};

export default Home;
