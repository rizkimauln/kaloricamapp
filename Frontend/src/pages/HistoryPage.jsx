import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Camera, Clock } from 'lucide-react';

const HistoryPage = ({ isDark }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ total: 0, day: 0, week: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeFilter]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        try {
          const [histRes, homeRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/history?user_id=${parsedUser.id}`),
            fetch(`${import.meta.env.VITE_API_URL}/home?user_id=${parsedUser.id}`)
          ]);

          if (histRes.ok && homeRes.ok) {
            const histJson = await histRes.json();
            const homeJson = await homeRes.json();
            
            setHistoryData(histJson.history || []);
            
            setStats({
              total: homeJson.stats.total_scans,
              day: homeJson.today.scan_count,
              week: homeJson.stats.week_scans_count
            });
          }
        } catch (err) {
          console.error("Gagal mengambil riwayat", err);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };

    fetchHistoryData();
  }, [navigate]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    if (isToday) return `HARI INI — ${formattedDate.toUpperCase()}`;
    if (isYesterday) return `KEMARIN — ${formattedDate.toUpperCase()}`;
    return formattedDate.toUpperCase();
  };

  return (
    <div className="page history-page mobile-container" style={{ padding: '20px', background: 'white', minHeight: '100vh', paddingBottom: '90px' }}>
      
      <header style={{ marginBottom: '25px', paddingTop: '10px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a' }}>Riwayat</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Rekam jejak scan kamu</p>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <div style={{ flex: 1, padding: '15px 10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '7px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{stats.total}</div>
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0 }}>Total Scan</p>
        </div>
        <div style={{ flex: 1, padding: '15px 10px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '7px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{stats.day}</div>
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0 }}>Hari ini</p>
        </div>
        <div style={{ flex: 1, padding: '15px 10px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '7px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{stats.week}</div>
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0 }}>Minggu ini</p>
        </div>
      </div>

      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '13px', display: 'flex', marginBottom: '25px' }}>
        {['Semua', 'Hari ini', 'Minggu', 'Bulan'].map((tab) => (
          <button
            key={tab}
            style={{ 
              flex: 1, 
              padding: '8px 0', 
              borderRadius: '11px', 
              border: 'none', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              background: activeFilter === tab ? '#10b981' : 'transparent',
              color: activeFilter === tab ? 'white' : '#94a3b8',
              transition: 'all 0.3s'
            }}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>Memuat riwayat...</p>
        ) : historyData.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>Belum ada riwayat makanan.</p>
        ) : (
          historyData.map((group, gIdx) => (
            <div key={gIdx} style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                <Calendar size={14} />
                <span>{formatDateLabel(group.date)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 15px', 
                    background: 'white', 
                    border: '1px solid #f1f5f9',
                    borderLeft: '2px solid #10b981',
                    borderRadius: '2px',
                  }}>
                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: '15px' }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Camera size={18} color="#94a3b8" />
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{item.food_name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.7rem' }}>
                        <Clock size={10} />
                        <span>{formatTime(item.scan_time)} • {item.portion || '1 Porsi'}</span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981' }}>
                      {item.calories}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#ecfdf5', borderRadius: '4px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Total hari ini</span>
                <span style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: '800' }}>{group.total_calories} Kal</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
