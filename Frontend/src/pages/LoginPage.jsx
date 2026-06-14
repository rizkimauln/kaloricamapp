import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Mohon isi email dan password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login gagal. Periksa kembali data Anda.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page login-page">
      <div className="auth-header ">
        <div className="logo-box-auth ">
          <Camera size={40} color="white" />
        </div>
        <h1>Selamat Datang!</h1>
        <p>Masuk ke akunmu untuk melanjutkan</p>
      </div>

      <div className="auth-form " >
        {error && <div style={{ color: '#ef4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', background: '#fee2e2', padding: '10px', borderRadius: '4px' }}>{error}</div>}
        
        <div className="input-group-modern">
          <label>EMAIL</label>
          <div className="input-with-icon">
            <Mail size={20} className="input-icon" />
            <input type="email" placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="input-group-modern">
          <label>PASSWORD</label>
          <div className="input-with-icon">
            <Lock size={20} className="input-icon" />
            <input type="password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="forgot-box">
            <span className="forgot">Lupa password?</span>
          </div>
        </div>
        
        <button className="primary-btn-modern auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="switch-auth-text">
          Belum punya akun? <span onClick={() => navigate('/register')}>Daftar sekarang</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
