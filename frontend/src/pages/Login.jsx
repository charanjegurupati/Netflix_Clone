import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-overlay"></div>
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign In</h2>
          {error && <div className="auth-error">{error}</div>}
          <input 
            type="email" 
            placeholder="Email or phone number" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="btn btn-auth">Sign In</button>
          
          <div className="auth-footer">
            <span>New to Netflix? <Link to="/signup">Sign up now.</Link></span>
            <p style={{marginTop: '20px', fontSize: '13px', color: '#8c8c8c'}}>
              <strong>Disclaimer:</strong> This is an educational portfolio project and is NOT the real Netflix. Please do not enter real passwords or personal information.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
