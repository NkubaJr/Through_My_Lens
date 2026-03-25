import { Link } from 'react-router-dom';

const cardStyles = [
  { bg: '#f5ebe0', text: '#3b1f0e', sub: '#a85f18', story: '#5c3212' },
  { bg: '#3b1f0e', text: '#f5ebe0', sub: '#e49a3a', story: '#e8d5b7' },
  { bg: '#fde8c8', text: '#3b1f0e', sub: '#a85f18', story: '#5c3212' },
  { bg: '#5c3212', text: '#fde8c8', sub: '#e49a3a', story: '#e8d5b7' },
  { bg: '#e8c9a0', text: '#3b1f0e', sub: '#7d4415', story: '#5c3212' },
  { bg: '#7d4415', text: '#f5ebe0', sub: '#e49a3a', story: '#fde8c8' },
];

export default function ArtworkCard({ artwork, index }) {
  const style = cardStyles[index % cardStyles.length];

  return (
    <Link to={`/artwork/${artwork.artwork_id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: style.bg,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(59,31,14,0.12)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          height: '100%'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,31,14,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(59,31,14,0.12)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
          <img
            src={artwork.file_url}
            alt={artwork.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Category badge */}
          <div style={{
            position: 'absolute', bottom: '12px', left: '12px',
            backgroundColor: '#e49a3a',
            color: '#3b1f0e',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: '600'
          }}>
            {artwork.category}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px 20px' }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: style.text,
            marginBottom: '4px'
          }}>
            {artwork.title}
          </h3>
          <p style={{ fontSize: '0.82rem', color: style.sub, marginBottom: '8px' }}>
            by {artwork.username} · {artwork.country}
          </p>
          <p style={{
            fontSize: '0.85rem',
            color: style.story,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.5'
          }}>
            {artwork.story}
          </p>
        </div>
      </div>
    </Link>
  );
}