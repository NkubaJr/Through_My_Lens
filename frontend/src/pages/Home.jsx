import { useState, useEffect } from 'react';
import axios from 'axios';
import ArtworkCard from '../components/ArtworkCard';

const CATEGORIES = ['All Categories', 'Photography', 'Painting', 'Digital Art', 'Illustration', 'Mixed Media'];
const COUNTRIES = ['All Countries', 'Rwanda', 'Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Ethiopia', 'Tanzania', 'Uganda', 'Senegal', 'Other'];

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All Categories');
  const [country, setCountry] = useState('All Countries');

  useEffect(() => {
    fetchArtworks();
  }, [category, country]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All Categories') params.category = category;
      if (country !== 'All Countries') params.country = country;
      const res = await axios.get('http://localhost:5000/api/artworks', { params });
      setArtworks(res.data);
    } catch (err) {
      console.error('Failed to fetch artworks', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          color: '#3b1f0e',
          lineHeight: 1.1,
          marginBottom: '16px',
          fontFamily: 'Playfair Display, serif'
        }}>
          Africa through my lens
        </h1>
        <p style={{ color: '#a85f18', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>
          Stories, art, and culture from young African creatives
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: '#3b1f0e', fontWeight: '500' }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              border: '2px solid #a85f18',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '0.95rem',
              color: '#3b1f0e',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '180px'
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: '#3b1f0e', fontWeight: '500' }}>Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              border: '2px solid #a85f18',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '0.95rem',
              color: '#3b1f0e',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '180px'
            }}
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#a85f18' }}>Loading gallery...</div>
      ) : artworks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#a85f18', fontSize: '1.2rem' }}>No artworks yet.</p>
          <p style={{ color: '#c9a06a', fontSize: '0.9rem', marginTop: '8px' }}>Be the first to share your story!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {artworks.map((artwork, index) => (
            <ArtworkCard key={artwork.artwork_id} artwork={artwork} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}