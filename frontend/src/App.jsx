import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios
const API_URL = 'https://aivants.backendbots.com/api/school-mgmt';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Components
function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAuth(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>School Portal Login</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input 
              type="text" 
              className="input-field" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ setAuth }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">EduSys Pro</div>
      <Link to="/dashboard" className="nav-link active">
        <span>📊</span> Dashboard
      </Link>
      <Link to="/students" className="nav-link">
        <span>👨‍🎓</span> Students
      </Link>
      <Link to="/teachers" className="nav-link">
        <span>👨‍🏫</span> Teachers
      </Link>
      <Link to="/attendance" className="nav-link">
        <span>✅</span> Attendance
      </Link>
      <Link to="/fees" className="nav-link">
        <span>💰</span> Fees
      </Link>
      <Link to="/notices" className="nav-link">
        <span>📢</span> Notices
      </Link>
      <div style={{ flex: 1 }}></div>
      <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', width: '100%' }}>
        Logout
      </button>
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <div className="main-content">
      <h1>Welcome back, {user?.username || 'Admin'} 👋</h1>
      <p style={{ marginBottom: '2rem' }}>Here is your school management overview.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Students</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>450</div>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Teachers</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)' }}>32</div>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Today's Attendance</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#F59E0B' }}>94%</div>
        </div>
      </div>
    </div>
  );
}

function Layout({ children, setAuth }) {
  return (
    <div className="app-container">
      <Sidebar setAuth={setAuth} />
      {children}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Layout setAuth={setIsAuthenticated}><Dashboard /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
