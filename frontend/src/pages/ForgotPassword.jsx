import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE from '../config.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#3b1f0e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>🔑</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: '800', color: '#3b1f0e', marginBottom: '6px' }}>Forgot Password?</h2>
          <p style={{ color: '#a85f18', fontSize: '0.9rem' }}>Enter your email and we'll send you a reset link</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(59,31,14,0.1)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📬</div>
              <h3 style={{ color: '#3b1f0e', marginBottom: '8px' }}>Check your inbox!</h3>
              <p style={{ color: '#a85f18', fontSize: '0.9rem' }}>If that email is registered, a reset link is on its way.</p>
              <Link to="/login" style={{ display: 'inline-block', marginTop: '20px', color: '#3b1f0e', fontWeight: '700' }}>Back to Login</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', backgroundColor: loading ? '#c9a06a' : '#3b1f0e', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#a85f18' }}>
                <Link to="/login" style={{ color: '#3b1f0e', fontWeight: '700', textDecoration: 'none' }}>Back to Login</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '12px 16px', border: '2px solid #e8d5b7', borderRadius: '12px', fontSize: '0.92rem', color: '#3b1f0e', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fdf8f0', fontFamily: 'inherit' };