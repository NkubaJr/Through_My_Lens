import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import ConnectModal from '../components/ConnectModal';
import API_BASE from '../config.js';

export default function ArtworkDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentMessage, setCommentMessage] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => { fetchArtwork(); }, [id]);

  const fetchArtwork = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/artworks/${id}`);
      setArtwork(res.data);
      setLikes(res.data.likes || 0);
      setComments(res.data.comments || []);
    } catch {
      toast.error('Artwork not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) { toast.error('Please log in to like this artwork'); return; }
    try {
      const identifier = user.id.toString();
      const res = await axios.post(`${API_BASE}/api/artworks/${id}/like`, { visitor_identifier: identifier });
      setLiked(res.data.liked);
      setLikes(res.data.likes);
    } catch { toast.error('Something went wrong'); }
  };

  const handleComment = async () => {
    if (!user) { toast.error('Please log in to comment'); return; }
    if (!commentMessage) { toast.error('Please write a comment'); return; }
    setSubmittingComment(true);
    try {
      await axios.post(`${API_BASE}/api/artworks/${id}/comment`, { name: user.username, message: commentMessage });
      toast.success('Comment posted!');
      setCommentMessage('');
      setShowCommentForm(false);
      fetchArtwork();
    } catch { toast.error('Failed to post comment'); }
    finally { setSubmittingComment(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await axios.delete(`${API_BASE}/api/artworks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Artwork deleted');
      navigate('/profile');
    } catch { toast.error('Failed to delete artwork'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#a85f18' }}>Loading...</div>;
  if (!artwork) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 24px 60px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#a85f18', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        Back to Gallery
      </button>

      <div style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(59,31,14,0.1)' }}>
        <img src={artwork.file_url} alt={artwork.title} style={{ width: '100%', height: '420px', objectFit: 'cover' }} />

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: '800', color: '#3b1f0e', marginBottom: '6px' }}>
                {artwork.title}
              </h1>
              <p style={{ color: '#a85f18', fontSize: '0.9rem' }}>by {artwork.username} · {artwork.country}</p>
            </div>
            <span style={{ backgroundColor: '#fde8c8', color: '#7d4415', padding: '6px 16px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '600' }}>
              {artwork.category}
            </span>
          </div>

          <div style={{ borderTop: '1px solid #f0d9b5', paddingTop: '24px', marginTop: '8px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#3b1f0e', marginBottom: '12px' }}>The Story</h3>
            <p style={{ color: '#5c3212', lineHeight: '1.8', fontSize: '0.95rem' }}>{artwork.story}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            <button
              onClick={handleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px',
                backgroundColor: liked ? '#fde8c8' : 'white',
                color: liked ? '#7d4415' : '#a85f18',
                border: '2px solid #e8d5b7', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              {liked ? '❤️' : '🤍'} {likes} {likes === 1 ? 'Like' : 'Likes'}
            </button>

            <button
              onClick={() => {
                if (!user) { toast.error('Please log in to comment'); return; }
                setShowCommentForm(!showCommentForm);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px',
                backgroundColor: showCommentForm ? '#f5ebe0' : 'white',
                color: '#a85f18', border: '2px solid #e8d5b7',
                borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </button>

            {(!user || user.id !== artwork.user_id) && (
              <button
                onClick={() => {
                  if (!user) { toast.error('Please log in to connect'); return; }
                  setShowModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', backgroundColor: '#3b1f0e',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
                }}
              >
                🤝 Connect with Artist
              </button>
            )}
          </div>

          {showCommentForm && user && (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5ebe0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e49a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#3b1f0e' }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <p style={{ fontWeight: '600', color: '#3b1f0e', fontSize: '0.88rem' }}>{user.username}</p>
              </div>
              <textarea
                placeholder="Share your thoughts about this artwork..."
                value={commentMessage}
                onChange={e => setCommentMessage(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '11px 16px', border: '2px solid #e8d5b7', borderRadius: '12px', fontSize: '0.92rem', color: '#3b1f0e', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', backgroundColor: 'white' }}
              />
              <button
                onClick={handleComment} disabled={submittingComment}
                style={{ marginTop: '10px', padding: '10px 24px', backgroundColor: '#3b1f0e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem' }}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          )}

          {comments.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#3b1f0e', marginBottom: '14px', fontSize: '1rem' }}>Comments</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.map(comment => (
                  <div key={comment.comment_id} style={{ backgroundColor: '#f5ebe0', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e49a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: '#3b1f0e' }}>
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <p style={{ fontWeight: '600', color: '#3b1f0e', fontSize: '0.88rem' }}>{comment.name}</p>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#c9a06a' }}>{new Date(comment.created_at).toLocaleDateString()}</p>
                    </div>
                    <p style={{ color: '#5c3212', fontSize: '0.88rem', lineHeight: '1.6', paddingLeft: '36px' }}>{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user && user.id === artwork.user_id && (
            <button
              onClick={handleDelete}
              style={{ marginTop: '24px', width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#dc2626', border: '2px solid #fca5a5', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Delete Artwork
            </button>
          )}
        </div>
      </div>

      {showModal && <ConnectModal artwork={artwork} onClose={() => setShowModal(false)} />}
    </div>
  );
}