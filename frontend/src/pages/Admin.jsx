import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import API_BASE from '../config.js';

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, hidden: 0, active: 0 });

  useEffect(() => {
    if (user === null) return;
    if (user.role !== 'Admin') { navigate('/'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/artworks/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArtworks(res.data);
      setStats({
        total: res.data.length,
        active: res.data.filter(a => a.status === 'active').length,
        hidden: res.data.filter(a => a.status === 'hidden').length
      });
    } catch {
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleHide = async (id, currentStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/artworks/${id}/hide`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setArtworks(artworks.map(a => a.artwork_id === id ? { ...a, status: res.data.status } : a));
      setStats(prev => ({
        total: prev.total,
        active: res.data.status === 'hidden' ? prev.active - 1 : prev.active + 1,
        hidden: res.data.status === 'hidden' ? prev.hidden + 1 : prev.hidden - 1
      }));
    } catch { toast.error('Failed to update artwork'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this artwork?')) return;
    try {
      await axios.delete(`${API_BASE}/api/artworks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Artwork deleted');
      setArtworks(artworks.filter(a => a.artwork_id !== id));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
    } catch { toast.error('Failed to delete artwork'); }
  };

  if (user === null) return <div style={{ textAlign: 'center', padding: '80px', color: '#a85f18' }}>Loading...</div>;
  if (user.role !== 'Admin') return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 60px' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#3b1f0e', borderRadius: '20px',
        padding: '28px 32px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
            Admin Dashboard
          </h2>
          <p style={{ color: '#e49a3a', fontSize: '0.88rem' }}>My Lens Content Moderation Panel</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: stats.total, color: '#e49a3a' },
            { label: 'Active', value: stats.active, color: '#4ade80' },
            { label: 'Hidden', value: stats.hidden, color: '#f87171' }
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '1.4rem', fontWeight: '800' }}>{stat.value}</p>
              <p style={{ color: '#f5ebe0', fontSize: '0.75rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(59,31,14,0.08)' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#3b1f0e', fontSize: '1.1rem', marginBottom: '20px', fontWeight: '700' }}>
          All Artworks
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a85f18' }}>Loading...</div>
        ) : artworks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a85f18' }}>No artworks yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {artworks.map(artwork => (
              <div key={artwork.artwork_id} style={{
                backgroundColor: artwork.status === 'hidden' ? '#fff5f5' : '#fdf8f0',
                borderRadius: '14px', padding: '16px',
                display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
                border: artwork.status === 'hidden' ? '1.5px solid #fca5a5' : '1.5px solid #f0d9b5'
              }}>
                <img src={artwork.file_url} alt={artwork.title} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <p style={{ fontWeight: '700', color: '#3b1f0e', fontSize: '0.95rem' }}>{artwork.title}</p>
                  <p style={{ color: '#a85f18', fontSize: '0.8rem', marginTop: '2px' }}>by {artwork.username} · {artwork.category} · {artwork.country}</p>
                  <p style={{ color: '#c9a06a', fontSize: '0.75rem', marginTop: '2px' }}>{new Date(artwork.created_at).toLocaleDateString()}</p>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0,
                  backgroundColor: artwork.status === 'active' ? '#dcfce7' : '#fee2e2',
                  color: artwork.status === 'active' ? '#16a34a' : '#dc2626'
                }}>
                  {artwork.status}
                </span>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleHide(artwork.artwork_id, artwork.status)}
                    style={{
                      padding: '8px 16px', border: 'none', borderRadius: '8px',
                      fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer',
                      backgroundColor: artwork.status === 'active' ? '#fde8c8' : '#dcfce7',
                      color: artwork.status === 'active' ? '#7d4415' : '#16a34a'
                    }}
                  >
                    {artwork.status === 'active' ? 'Hide' : 'Unhide'}
                  </button>
                  <button
                    onClick={() => handleDelete(artwork.artwork_id)}
                    style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}