import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Camera, Search, User, LogIn } from 'lucide-react';
import './App.css';

// Pages (to be implemented)
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ScanPage from './pages/ScanPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResultPage from './pages/ResultPage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, path: '/', label: 'Home' },
    { icon: <History size={24} />, path: '/history', label: 'History' },
    { icon: <div className="scan-btn-inner"><Camera size={28} color="white" /></div>, path: '/scan', label: 'Scan', special: true },
    { icon: <Search size={24} />, path: '/explore', label: 'Explore' },
    { icon: <User size={24} />, path: '/profile', label: 'Profile' }
  ];

  if (
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/scan' ||
    location.pathname === '/edit-profile' ||
    location.pathname === '/change-password'
  ) return null;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <div 
          key={item.path} 
          className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${item.special ? 'special' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          {!item.special && <span>{item.label}</span>}
        </div>
      ))}
    </nav>
  );
};

function App() {
  const [isDark, setIsDark] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} />} />
          <Route path="/history" element={<HistoryPage isDark={isDark} />} />
          <Route path="/scan" element={<ScanPage isDark={isDark} />} />
          <Route path="/result" element={<ResultPage isDark={isDark} />} />
          <Route path="/explore" element={<ExplorePage isDark={isDark} />} />
          <Route path="/profile" element={<ProfilePage isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<LoginPage isDark={isDark} />} />
          <Route path="/register" element={<RegisterPage isDark={isDark} />} />
          <Route path="/edit-profile" element={<EditProfilePage isDark={isDark} />} />
          <Route path="/change-password" element={<ChangePasswordPage isDark={isDark} />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
