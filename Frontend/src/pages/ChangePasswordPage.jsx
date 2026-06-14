import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChangePassword = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(storedUser);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ text: 'Semua kolom harus diisi.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Konfirmasi password tidak cocok.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'Password baru minimal 6 karakter.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id, 
          old_password: oldPassword, 
          new_password: newPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Password berhasil diubah!', type: 'success' });
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setMessage({ text: data.message || 'Gagal mengubah password.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Gagal terhubung ke server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page edit-profile-page">
      <button className="back-btn-auth" onClick={() => navigate('/profile')} style={{ top: '20px' }}>
        <ArrowLeft size={24} />
      </button>

      <header className="page-header" style={{ justifyContent: 'center', padding: '25px 20px 10px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Ubah Password</h1>
      </header>

      <div className="auth-form " style={{  marginTop: '20px' }}>

        {message.text && (
          <div style={{ color: message.type === 'success' ? '#15803d' : '#ef4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', padding: '10px', borderRadius: '4px' }}>
            {message.text}
          </div>
        )}

        <div className="input-group-modern">
          <label>PASSWORD LAMA</label>
          <div className="input-with-icon">
            <Lock size={20} className="input-icon" />
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Masukkan password lama" />
          </div>
        </div>

        <div className="input-group-modern">
          <label>PASSWORD BARU</label>
          <div className="input-with-icon">
            <Lock size={20} className="input-icon" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Masukkan password baru" />
          </div>
        </div>

        <div className="input-group-modern">
          <label>KONFIRMASI PASSWORD</label>
          <div className="input-with-icon">
            <Lock size={20} className="input-icon" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" />
          </div>
        </div>
        
        <button className="primary-btn-modern auth-btn" onClick={handleChangePassword} disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Memproses...' : 'Perbarui Password'}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
