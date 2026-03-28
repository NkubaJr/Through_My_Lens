import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import API_BASE from '../config.js';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, form);
      login(res.data.user, res.data.token);
      toast.success('Welcome back, ' + res.data.user.username + '!');
      if (res.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#3b1f0e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '1.8rem'
          }}>📸</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: '800', color: '#3b1f0e', marginBottom: '6px' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#a85f18', fontSize: '0.9rem' }}>Log in to your My Lens account</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(59,31,14,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
            </div>
            <button
              onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', padding: '13px',
                backgroundColor: loading ? '#c9a06a' : '#3b1f0e',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px'
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#a85f18', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b1f0e', fontWeight: '700', textDecoration: 'none' }}>Join Us</Link>
          </p>
        </div>
        <p style={{ textAlign: 'center', color: '#c9a06a', fontSize: '0.82rem', marginTop: '20px' }}>
          Stories, art and culture from young African creatives
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '12px 16px', border: '2px solid #e8d5b7', borderRadius: '12px', fontSize: '0.92rem', color: '#3b1f0e', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fdf8f0', fontFamily: 'inherit' };