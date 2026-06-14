import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Lightbulb, Camera, Check 
} from 'lucide-react';

const ResultPage = ({ isDark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSaving, setIsSaving] = React.useState(false);

  // Get the API response data and captured image
  const { result, capturedImage } = location.state || {};
  
  // Fallback data if no result
  const detectedItem = result?.prediction || 'Makanan tidak dikenal';
  const confidence = result?.confidence || '0%';
  const nutrition = result?.nutrition || {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    unit: '100g'
  };



  const handleSaveScan = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user.id,
            food_name: detectedItem,
            calories: nutrition.calories,
            protein: nutrition.protein,
            fat: nutrition.fat,
            carbs: nutrition.carbs,
            portion: nutrition.unit || '100g',
            image_url: capturedImage
          })
        });
      } catch (err) {
        console.error('Failed to save scan', err);
      }
    }
    
    setIsSaving(false);
    navigate('/history');
  };

  return (
    <div className="page result-page-modern mobile-container">
      <header className="scan-header-modern ">
        <button className="icon-btn-round" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="scan-title-container">
          <h3>Hasil Scan Makanan</h3>
          <p>Informasi nutrisi terdeteksi</p>
        </div>
      </header>

      <div className="captured-image-container">
        <div className="captured-image-box card">
          {/* Display the actual captured image or placeholder */}
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured food" 
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '4px' 
              }} 
            />
          ) : (
            <div className="image-placeholder">
              <Camera size={48} color="#9ca3af" />
              <p>Gambar makanan</p>
            </div>
          )}
          <div className="image-detection-badge">
            <CheckCircle2 size={16} color="#10b981" />
            <span>{detectedItem} • {confidence}</span>
          </div>
        </div>
      </div>

      <div className="calorie-summary-card-modern card " >
        <p className="summary-label">Total Kalori</p>
        <div className="summary-val-box">
          <span className="number ">{nutrition.calories}</span>
          <span className="unit">Kal</span>
        </div>
      </div>



      <div className="suggestion-section">
        <div className="suggestion-title-modern">
          <Lightbulb size={20} color="#f59e0b" />
          <h3>Saran untuk Kamu</h3>
        </div>
        <div className="suggestion-content-box-modern card">
          <p>
            Berdasarkan hasil deteksi "{detectedItem}" dengan tingkat kepercayaan {confidence}, pastikan untuk memperhatikan porsi makan Anda. Untuk informasi nutrisi yang lebih lengkap, pertimbangkan untuk memverifikasi dengan sumber yang dapat dipercaya.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', marginBottom: '20px' }}>
        <button onClick={() => navigate('/scan')} style={{ flex: 1, padding: '14px', borderRadius: '17px', background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          <Camera size={18} />
          Foto Ulang
        </button>
        <button disabled={isSaving} onClick={handleSaveScan} style={{ flex: 1, padding: '14px', borderRadius: '17px', background: '#10b981', border: 'none', color: 'white', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}>
          <Check size={18} />
          {isSaving ? 'Menyimpan...' : 'Oke'}
        </button>
      </div>
    </div>
  );
};

export default ResultPage;