import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchMyArtworks();
  }, [user]);

  const fetchMyArtworks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/artworks');
      const mine = res.data.filter(a => a.user_id === user.id);
      setArtworks(mine);

      const allConnections = [];
      for (const artwork of mine) {
        try {
          const conn = await axios.get(
            `http://localhost:5000/api/artworks/${artwork.artwork_id}/connections`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          conn.data.forEach(c => allConnections.push({ ...c, artwork_title: artwork.title }));
        } catch {}
      }
      setConnections(allConnections);
    } catch {
      toast.error('Failed to load your portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this artwork?')) return;
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

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 24px 60px' }}>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '32px',
        flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: '#e49a3a',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#3b1f0e" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.8rem', fontWeight: '800', color: '#3b1f0e'
            }}>
              My Portfolio
            </h2>
            <p style={{ color: '#a85f18', fontSize: '0.88rem' }}>{user.username}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/upload"
            style={{
              backgroundColor: '#3b1f0e', color: 'white',
              padding: '10px 20px', borderRadius: '12px',
              textDecoration: 'none', fontSize: '0.88rem',
              fontWeight: '600'
            }}
          >
            Upload New
          </Link>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#f5ebe0', color: '#3b1f0e',
              padding: '10px 20px', borderRadius: '12px',
              border: 'none', fontSize: '0.88rem',
              fontWeight: '600', cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: '8px', marginBottom: '28px',
        backgroundColor: '#f5ebe0', padding: '4px',
        borderRadius: '14px', width: 'fit-content'
      }}>
        {['portfolio', 'connections'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 24px', borderRadius: '10px',
              border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '0.88rem',
              backgroundColor: activeTab === tab ? '#3b1f0e' : 'transparent',
              color: activeTab === tab ? 'white' : '#a85f18',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'portfolio' ? 'My Artworks' : 'Connections ' + (connections.length > 0 ? '(' + connections.length + ')' : '')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a85f18' }}>Loading...</div>
      ) : activeTab === 'portfolio' ? (
        artworks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#a85f18', fontSize: '1.1rem' }}>No artworks yet.</p>
            <Link to="/upload" style={{ color: '#3b1f0e', fontSize: '0.9rem', marginTop: '8px', display: 'block' }}>
              Upload your first piece
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {artworks.map(artwork => (
              <div key={artwork.artwork_id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                overflow: 'hidden', boxShadow: '0 2px 12px rgba(59,31,14,0.08)'
              }}>
                <Link to={`/artwork/${artwork.artwork_id}`}>
                  <img
                    src={artwork.file_url}
                    alt={artwork.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Link>
                <div style={{ padding: '14px' }}>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#3b1f0e', fontSize: '1rem', marginBottom: '4px'
                  }}>
                    {artwork.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#a85f18' }}>
                    {artwork.category} · {artwork.country}
                  </p>
                  <button
                    onClick={() => handleDelete(artwork.artwork_id)}
                    style={{
                      marginTop: '10px', width: '100%',
                      padding: '7px', backgroundColor: 'transparent',
                      border: '1.5px solid #fca5a5', color: '#dc2626',
                      borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        connections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#a85f18', fontSize: '1.1rem' }}>No connections yet.</p>
            <p style={{ color: '#c9a06a', fontSize: '0.88rem', marginTop: '6px' }}>
              When someone reaches out about your art, they will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {connections.map(conn => (
              <div key={conn.transaction_id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                padding: '20px', boxShadow: '0 2px 12px rgba(59,31,14,0.08)'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '10px'
                }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#3b1f0e', fontSize: '1rem' }}>
                      {conn.visitor_name}
                    </p>
                    <p style={{ color: '#a85f18', fontSize: '0.85rem' }}>
                      {conn.visitor_email}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {conn.amount && conn.amount !== '0' && (
                      <span style={{
                        backgroundColor: '#fde8c8', color: '#7d4415',
                        padding: '4px 12px', borderRadius: '999px',
                        fontSize: '0.82rem', fontWeight: '600'
                      }}>
                        Offer: ${conn.amount}
                      </span>
                    )}
                    <p style={{ fontSize: '0.75rem', color: '#c9a06a', marginTop: '4px' }}>
                      re: {conn.artwork_title}
                    </p>
                  </div>
                </div>
                <p style={{ color: '#5c3212', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {conn.message}
                </p>
                <button
                  onClick={() => {
                    const subject = encodeURIComponent('Re: ' + conn.artwork_title);
                    const body = encodeURIComponent('Hi ' + conn.visitor_name + ',\n\n');
                    const gmail = 'https://mail.google.com/mail/?view=cm&to=' + conn.visitor_email + '&su=' + subject + '&body=' + body;
                    window.open(gmail, '_blank');
                  }}
                  style={{
                    marginTop: '12px',
                    backgroundColor: '#3b1f0e', color: 'white',
                    padding: '8px 18px', borderRadius: '8px',
                    fontSize: '0.82rem', fontWeight: '600',
                    border: 'none', cursor: 'pointer'
                  }}
                >
                  Reply via Gmail
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}