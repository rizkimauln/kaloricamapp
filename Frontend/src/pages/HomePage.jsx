import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Camera, Utensils, BarChart3, Search, User 
} from 'lucide-react';

const HomePage = ({ isDark }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Pengguna' });
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    today: { calories: 0, scan_count: 0 },
    stats: { total_scans: 0, total_foods: 0, active_days: 0 },
    recent_scans: []
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/home?user_id=${parsedUser.id}`);
          if (res.ok) {
            const data = await res.json();
            setHomeData(data);
          }
        } catch (err) {
          console.error("Gagal mengambil data home", err);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };

    fetchHomeData();
  }, [navigate]);

  const totalKal = homeData.today.calories;
  const targetKal = 2000;
  const sisaKal = targetKal - totalKal > 0 ? targetKal - totalKal : 0;
  const progressPercent = Math.min((totalKal / targetKal) * 100, 100);
  // Calculate stroke dash offset (282.7 is the circumference of circle r=45)
  const dashOffset = 282.7 - (282.7 * progressPercent) / 100;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page home-page mobile-container">
      <header className="home-header-modern ">
        <div className="user-greeting">
          <p>{getGreeting()}</p>
          <h1>Halo, {user.name.split(' ')[0]}!</h1>
        </div>
        <div className="header-action-icon" onClick={() => navigate('/profile')} style={{ overflow: 'hidden', padding: user.avatar_url ? 0 : undefined }}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <User size={24} />
          )}
        </div>
      </header>

      <div className="home-summary-card card ">
        <div className="summary-left">
          <div className="circular-progress-box">
             <svg width="100" height="100">
                <circle cx="50" cy="50" r="45" stroke={isDark ? "#1e293b" : "#f1f5f9"} strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="8" fill="none" 
                  strokeDasharray="282.7" strokeDashoffset={loading ? 282.7 : dashOffset} strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
             </svg>
             <div className="inner-text">
                <span className="val ">{totalKal}</span>
                <span className="unit">Kal</span>
             </div>
          </div>
        </div>
        <div className="summary-right">
          <p className="label">TARGET HARIAN</p>
          <h2 className="total-val">{totalKal} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {targetKal}</span></h2>
          <p className="sub-label">Sisa <span>{sisaKal} Kal</span> lagi</p>
        </div>
      </div>

      <div className="quick-stats-grid">
        <div className="stat-puck card" >
          <div className="puck-icon orange"><Flame size={16} /></div>
          <span className="puck-val">{homeData.today.calories >= 1000 ? (homeData.today.calories/1000).toFixed(1) + 'k' : homeData.today.calories}</span>
          <span className="puck-label">Kalori</span>
        </div>
        <div className="stat-puck card" >
          <div className="puck-icon blue"><Camera size={16} /></div>
          <span className="puck-val">{homeData.today.scan_count}</span>
          <span className="puck-label">Scan</span>
        </div>
        <div className="stat-puck card" >
          <div className="puck-icon green"><Utensils size={16} /></div>
          <span className="puck-val">{homeData.stats.total_foods}</span>
          <span className="puck-label">Makanan</span>
        </div>
        <div className="stat-puck card" >
          <div className="puck-icon purple"><BarChart3 size={16} /></div>
          <span className="puck-val">{homeData.stats.total_scans}</span>
          <span className="puck-label">Total</span>
        </div>
      </div>

      <div className="home-action-row">
        <div className="action-card-modern scan card" onClick={() => navigate('/scan')}>
          <div className="act-icon green"><Camera size={22} /></div>
          <div className="act-text">
            <h3>Scan</h3>
          </div>
        </div>
        <div className="action-card-modern explore card" onClick={() => navigate('/explore')}>
          <div className="act-icon blue"><Search size={22} /></div>
          <div className="act-text">
            <h3>Eksplor</h3>
          </div>
        </div>
      </div>

      <div className="section-header-modern">
        <h2>Scan Terakhir</h2>
        <span className="see-all-btn" onClick={() => navigate('/history')} style={{ cursor: 'pointer' }}>Lihat Semua</span>
      </div>

      <div className="recent-list-modern">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Memuat riwayat...</p>
        ) : homeData.recent_scans.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Belum ada makanan hari ini.</p>
        ) : (
          homeData.recent_scans.map((item, idx) => (
            <div key={idx} className="recent-item-card card" >
              <div className="item-img-box" style={{ overflow: 'hidden', padding: 0 }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={20} color="#94a3b8" />
                )}
              </div>
              <div className="item-info-box">
                <h3>{item.food_name}</h3>
                <p>Hari ini, {formatTime(item.scan_time)}</p>
              </div>
              <div className="item-cal-box">
                <span className="val">{item.calories}</span>
                <span className="unit">Kal</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
