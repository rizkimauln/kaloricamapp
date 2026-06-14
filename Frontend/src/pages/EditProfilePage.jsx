import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Pencil } from 'lucide-react';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdate = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ user_id: user.id, name, email, avatar_url: avatarUrl })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setMessage({ text: data.message || 'Gagal memperbarui profil.', type: 'error' });
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
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Edit Profil</h1>
      </header>

      <div className="auth-form " style={{  marginTop: '20px' }}>
        
        {message.text && (
          <div style={{ color: message.type === 'success' ? '#15803d' : '#ef4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', padding: '10px', borderRadius: '4px' }}>
            {message.text}
          </div>
        )}

        <div 
          className="profile-avatar-large" 
          style={{ margin: '0 auto 30px auto', position: 'relative', width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          <div className="edit-avatar-overlay">
            <Pencil size={24} />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setAvatarUrl(reader.result);
                reader.readAsDataURL(file);
              }
            }} 
          />
        </div>

        <div className="input-group-modern">
          <label>NAMA LENGKAP</label>
          <div className="input-with-icon">
            <User size={20} className="input-icon" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama" />
          </div>
        </div>

        <div className="input-group-modern">
          <label>EMAIL</label>
          <div className="input-with-icon">
            <Mail size={20} className="input-icon" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" />
          </div>
        </div>
        
        <button className="primary-btn-modern auth-btn" onClick={handleUpdate} disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
