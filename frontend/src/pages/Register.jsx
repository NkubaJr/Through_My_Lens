import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#3b1f0e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '1.8rem'
          }}>
            🌍
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2rem', fontWeight: '800',
            color: '#3b1f0e', marginBottom: '6px'
          }}>
            Join My Lens
          </h2>
          <p style={{ color: '#a85f18', fontSize: '0.9rem' }}>
            Share your story with the world
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(59,31,14,0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="yourname"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                backgroundColor: loading ? '#c9a06a' : '#3b1f0e',
                color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '1rem',
                fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#a85f18', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b1f0e', fontWeight: '700', textDecoration: 'none' }}>
              Log In
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#c9a06a', fontSize: '0.82rem', marginTop: '20px' }}>
          Stories, art and culture from young African creatives
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.85rem',
  fontWeight: '600', color: '#3b1f0e', marginBottom: '6px'
};

const inputStyle = {
  width: '100%', padding: '12px 16px',
  border: '2px solid #e8d5b7', borderRadius: '12px',
  fontSize: '0.92rem', color: '#3b1f0e',
  outline: 'none', boxSizing: 'border-box',
  backgroundColor: '#fdf8f0', fontFamily: 'inherit'
};