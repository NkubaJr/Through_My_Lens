import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE from '../config.js';

export default function ConnectModal({ artwork, onClose }) {
  const [form, setForm] = useState({ visitor_name: '', visitor_email: '', message: '', amount: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.visitor_name || !form.visitor_email) {
      toast.error('Please fill in your name and email');
      return;
    }
    if (!form.message) {
      toast.error('Please write a message for the artist');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/artworks/${artwork.artwork_id}/support`,
        {
          visitor_name: form.visitor_name,
          visitor_email: form.visitor_email,
          message: form.message,
          amount: form.amount || '0',
          type: 'support'
        }
      );
      toast.success(res.data.message);
      onClose();
    } catch (err) {
      console.error('Connect error:', err);
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(59,31,14,0.5)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 2000, padding: '24px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'white', borderRadius: '24px',
          padding: '32px', width: '100%', maxWidth: '460px',
          boxShadow: '0 20px 60px rgba(59,31,14,0.3)'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: '700', color: '#3b1f0e', marginBottom: '4px' }}>
            Connect with {artwork.username}
          </h3>
          <p style={{ color: '#a85f18', fontSize: '0.88rem' }}>Reach out about "{artwork.title}"</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input type="text" name="visitor_name" value={form.visitor_name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Your Email</label>
            <input type="email" name="visitor_email" value={form.visitor_email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Offer Amount (USD) — optional</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 50" style={inputStyle} />
            <p style={{ fontSize: '0.75rem', color: '#a85f18', marginTop: '4px' }}>
              This is just an offer — you and the artist will agree on payment directly
            </p>
          </div>
          <div>
            <label style={labelStyle}>Your Message</label>
            <textarea
              name="message" value={form.message} onChange={handleChange}
              rows={4} placeholder="Tell the artist why you love their work..."
              style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              padding: '13px', backgroundColor: loading ? '#c9a06a' : '#3b1f0e',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '0.95rem', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px'
            }}
          >
            {loading ? 'Sending...' : 'Send to Artist'}
          </button>

          <button
            onClick={onClose}
            style={{ padding: '10px', backgroundColor: 'transparent', color: '#a85f18', border: 'none', fontSize: '0.88rem', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 16px', border: '2px solid #e8d5b7', borderRadius: '12px', fontSize: '0.92rem', color: '#3b1f0e', outline: 'none', boxSizing: 'border-box' };