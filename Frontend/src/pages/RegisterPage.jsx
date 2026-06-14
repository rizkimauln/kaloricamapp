import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Mail, Lock, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Semua kolom harus diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Registrasi gagal. Coba email lain.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page register-page">
      <button className="back-btn-auth" onClick={() => navigate('/login')}>
        <ArrowLeft size={24} />
      </button>

      <div className="auth-header ">
        <div className="logo-box-auth ">
          <Camera size={40} color="white" />
        </div>
        <h1>Daftar Baru</h1>
        <p>Mulai perjalanan sehatmu hari ini</p>
      </div>

      <div className="auth-form " >
        {error && <div style={{ color: '#ef4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', background: '#fee2e2', padding: '10px', borderRadius: '4px' }}>{error}</div>}

        <div className="input-group-modern">
          <label>NAMA LENGKAP</label>
          <div className="input-with-icon">
            <User size={20} className="input-icon" />
            <input type="text" placeholder="Masukkan nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

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
            <input type="password" placeholder="Buat password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        
        <button className="primary-btn-modern auth-btn" onClick={handleRegister} disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>

        <p className="switch-auth-text">
          Sudah punya akun? <span onClick={() => navigate('/login')}>Masuk di sini</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
