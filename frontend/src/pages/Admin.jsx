import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/artworks/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArtworks(res.data);
    } catch {
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleHide = async (id, currentStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/artworks/${id}/hide`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setArtworks(artworks.map(a =>
        a.artwork_id === id ? { ...a, status: res.data.status } : a
      ));
    } catch {
      toast.error('Failed to update artwork');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this artwork?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Artwork deleted');
      setArtworks(artworks.filter(a => a.artwork_id !== id));
    } catch {
      toast.error('Failed to delete artwork');
    }
  };

  if (!user || user.role !== 'Admin') return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 24px 60px' }}>
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '2rem', fontWeight: '800',
        color: '#3b1f0e', marginBottom: '8px'
      }}>
        Admin Panel
      </h2>
      <p style={{ color: '#a85f18', fontSize: '0.9rem', marginBottom: '28px' }}>
        Moderate all content on My Lens
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a85f18' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {artworks.map(artwork => (
            <div key={artwork.artwork_id} style={{
              backgroundColor: artwork.status === 'hidden' ? '#fff0f0' : 'white',
              borderRadius: '16px', padding: '16px',
              boxShadow: '0 2px 12px rgba(59,31,14,0.08)',
              display: 'flex', gap: '16px', alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <img
                src={artwork.file_url}
                alt={artwork.title}
                style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '700', color: '#3b1f0e', fontSize: '1rem' }}>
                  {artwork.title}
                </p>
                <p style={{ color: '#a85f18', fontSize: '0.82rem' }}>
                  by {artwork.username} · {artwork.category} · {artwork.country}
                </p>
                <span style={{
                  display: 'inline-block', marginTop: '4px',
                  padding: '2px 10px', borderRadius: '999px',
                  fontSize: '0.75rem', fontWeight: '600',
                  backgroundColor: artwork.status === 'active' ? '#dcfce7' : '#fee2e2',
                  color: artwork.status === 'active' ? '#16a34a' : '#dc2626'
                }}>
                  {artwork.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleHide(artwork.artwork_id, artwork.status)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: artwork.status === 'active' ? '#fde8c8' : '#dcfce7',
                    color: artwork.status === 'active' ? '#7d4415' : '#16a34a',
                    border: 'none', borderRadius: '8px',
                    fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  {artwork.status === 'active' ? 'Hide' : 'Unhide'}
                </button>
                <button
                  onClick={() => handleDelete(artwork.artwork_id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#fee2e2', color: '#dc2626',
                    border: 'none', borderRadius: '8px',
                    fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}