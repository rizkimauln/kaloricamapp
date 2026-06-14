import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const ExplorePage = ({ isDark }) => {
  const [allFoods, setAllFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/foods`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setAllFoods(json.data);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data makanan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = allFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page explore-page mobile-container">
      <header className="page-header-stack">
        <h1>Eksplor Makanan</h1>
        <p>Cari dan temukan info kalori</p>
      </header>

      <div className="search-bar-modern">
        <Search size={20} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Cari makanan atau minuman..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="section-header-modern">
        <h2>Semua Makanan</h2>
      </div>

      <div className="food-list-modern">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Memuat data makanan...</p>
        ) : filteredFoods.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Makanan tidak ditemukan.</p>
        ) : (
          filteredFoods.map((food, idx) => (
            <div key={idx} className="explore-food-card card no-padding">
              <div className="explore-food-content">
                <div className="food-info">
                  <h3>{food.name}</h3>
                  <p>{food.detail}</p>
                </div>
                <div className="food-cal-modern">
                  <span className="val">{food.cal}</span>
                  <span className="unit">Kal</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
