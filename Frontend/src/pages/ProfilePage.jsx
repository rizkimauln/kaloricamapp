import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Bell, Globe, ChevronRight, Sun, Moon, Download, HelpCircle, ShieldCheck, LogOut 
} from 'lucide-react';

const ProfilePage = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Pengguna', email: 'email@kaloricam.com' });
  const [stats, setStats] = useState({ total_scans: 0, total_foods: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Fetch stats
      fetch(`${import.meta.env.VITE_API_URL}/home?user_id=${parsedUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.stats) {
            setStats(data.stats);
          }
        })
        .catch(err => console.error("Failed to fetch stats", err));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className="page profile-page mobile-container">
      <header className="page-header ">
        <h1>Profil</h1>
      </header>

      <div style={{ background: '#ecfdf5', borderRadius: '11px', padding: '20px', textAlign: 'center', marginBottom: '25px', boxShadow: '0 4px 15px rgba(16,185,129,0.08)' }} >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', padding: '4px', margin: '0 auto 10px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <img src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <h2 style={{ margin: '0 0 2px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: '700' }}>{user.name}</h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#10b981' }}>{user.email}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', borderTop: '1px solid rgba(16,185,129,0.1)', paddingTop: '15px' }}>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a' }}>{stats.total_scans}</strong>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Total Scan</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(16,185,129,0.1)' }}></div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a' }}>{stats.total_foods}</strong>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Makanan</p>
          </div>
        </div>
      </div>


      <div className="menu-section " >
        <h3>AKUN</h3>
        <div className="menu-group card no-padding">
          <div className="menu-item-modern border-bottom" onClick={() => navigate('/edit-profile')}>
            <div className="m-icon-box" style={{ background: isDark ? '#334155' : '#f3f4f6' }}><Settings size={20} color={isDark ? '#94a3b8' : '#6b7280'} /></div>
            <div className="m-text"><span>Edit Profil</span><p>Ubah nama dan foto</p></div>
            <ChevronRight size={18} color="#d1d5db" />
          </div>
          <div className="menu-item-modern" onClick={() => navigate('/change-password')}>
            <div className="m-icon-box" style={{ background: isDark ? '#1e1b4b' : '#f5f3ff' }}><Settings size={20} color="#8b5cf6" /></div>
            <div className="m-text"><span>Ubah Password</span><p>Ganti kata sandi</p></div>
            <ChevronRight size={18} color="#d1d5db" />
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h3>LAINNYA</h3>
        <div className="menu-group card no-padding">
          <div className="menu-item-modern border-bottom">
            <div className="m-icon-box" style={{ background: '#fffbeb' }}><Download size={20} color="#d97706" /></div>
            <div className="m-text"><span>Unduh Aplikasi</span><p>Pasang di perangkatmu</p></div>
            <ChevronRight size={18} color="#d1d5db" />
          </div>
          <div className="menu-item-modern border-bottom">
            <div className="m-icon-box" style={{ background: '#ecfdf5' }}><HelpCircle size={20} color="#10b981" /></div>
            <div className="m-text"><span>Bantuan & FAQ</span><p>Pusat bantuan</p></div>
            <ChevronRight size={18} color="#d1d5db" />
          </div>
          <div className="menu-item-modern">
            <div className="m-icon-box" style={{ background: '#f9fafb' }}><ShieldCheck size={20} color="#6b7280" /></div>
            <div className="m-text"><span>Kebijakan Privasi</span><p>Syarat dan ketentuan</p></div>
            <ChevronRight size={18} color="#d1d5db" />
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        Keluar
      </button>

      <div className="version-info">
        <p className="brand"><span>Kalori</span>Cam</p>
        <p className="ver">Versi 1.0.0 • © 2026</p>
      </div>
    </div>
  );
};

export default ProfilePage;
