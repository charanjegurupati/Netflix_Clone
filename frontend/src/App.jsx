import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyList from './pages/MyList';
import Admin from './pages/Admin';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/tv-shows" element={<ProtectedRoute><div style={{paddingTop: '100px', textAlign: 'center'}}><h2>TV Shows (Coming Soon)</h2></div></ProtectedRoute>} />
          <Route path="/movies" element={<ProtectedRoute><div style={{paddingTop: '100px', textAlign: 'center'}}><h2>Movies (Coming Soon)</h2></div></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
