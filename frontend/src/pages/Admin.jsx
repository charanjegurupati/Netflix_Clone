import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user } = React.useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    category: 'Trending Now'
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axiosInstance.get('/api/movies');
      setMovies(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/movies', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Movie added successfully!');
      setFormData({
        title: '',
        description: '',
        posterUrl: '',
        bannerUrl: '',
        trailerUrl: '',
        category: 'Trending Now'
      });
      fetchMovies();
    } catch (err) {
      alert('Failed to add movie.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Movie deleted!');
      fetchMovies();
    } catch (err) {
      alert('Failed to delete movie.');
      console.error(err);
    }
  };

  if (!user || user.email !== 'charanjegurupati@gmail.com') {
    return (
      <div className="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <h2 style={{ color: 'white' }}>You do not have permission to view this page.</h2>
      </div>
    );
  }

  return (
    <div className="home" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '100px', padding: '100px 4% 20px', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Admin Dashboard</h2>
        
        <div style={{ background: '#141414', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
          <h3>Add New Movie</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', maxWidth: '600px' }}>
            <input type="text" name="title" placeholder="Movie Title" value={formData.title} onChange={handleInputChange} required className="auth-input" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required className="auth-input" rows="3" />
            <input type="text" name="posterUrl" placeholder="Poster Image URL" value={formData.posterUrl} onChange={handleInputChange} required className="auth-input" />
            <input type="text" name="bannerUrl" placeholder="Banner Image URL" value={formData.bannerUrl} onChange={handleInputChange} required className="auth-input" />
            <input type="text" name="trailerUrl" placeholder="YouTube Trailer URL" value={formData.trailerUrl} onChange={handleInputChange} className="auth-input" />
            <select name="category" value={formData.category} onChange={handleInputChange} className="auth-input">
              <option value="Trending Now">Trending Now</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Action Movies">Action Movies</option>
              <option value="Comedies">Comedies</option>
              <option value="Horror Movies">Horror Movies</option>
              <option value="Romance Movies">Romance Movies</option>
              <option value="Documentaries">Documentaries</option>
            </select>
            <button type="submit" className="auth-button">Add Movie</button>
          </form>
        </div>

        <h3>Manage Movies</h3>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '10px' }}>Title</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie._id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>{movie.title}</td>
                  <td style={{ padding: '10px' }}>{movie.category}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleDelete(movie._id)} style={{ background: '#e50914', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
