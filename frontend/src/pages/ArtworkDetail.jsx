import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ArtworkDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {
    fetchArtwork();
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/artworks/${id}`);
      setArtwork(res.data);
    } catch {
      toast.error('Artwork not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async () => {
    setSupporting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/artworks/${id}/support`, {
        visitor_email: email || 'anonymous'
      });
      toast.success(res.data.message);
      setEmail('');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSupporting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Artwork deleted');
      navigate('/profile');
    } catch {
      toast.error('Failed to delete artwork');
    }
  };

  if (loading) return <div className="text-center py-20 text-earth-400">Loading...</div>;
  if (!artwork) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-earth-500 hover:text-earth-700 text-sm mb-6 flex items-center gap-1">
        ← Back to Gallery
      </button>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <img
          src={artwork.file_url}
          alt={artwork.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-earth-800">{artwork.title}</h1>
              <p className="text-earth-500 mt-1">by {artwork.username} · {artwork.country}</p>
            </div>
            <span className="bg-earth-100 text-earth-700 text-sm px-3 py-1 rounded-full">
              {artwork.category}
            </span>
          </div>

          <div className="border-t border-earth-100 pt-6 mt-4">
            <h3 className="text-lg font-semibold text-earth-700 mb-2">The Story</h3>
            <p className="text-earth-600 leading-relaxed">{artwork.story}</p>
          </div>

          {/* Support Artist Section */}
          <div className="bg-earth-50 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-earth-800 mb-1">Support this Artist 🎨</h3>
            <p className="text-earth-500 text-sm mb-4">Show your appreciation for this work</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (optional)"
              className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400 mb-3"
            />
            <button
              onClick={handleSupport}
              disabled={supporting}
              className="w-full bg-earth-600 hover:bg-earth-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {supporting ? 'Processing...' : '❤️ Support Artist'}
            </button>
          </div>

          {/* Delete button — only visible to the owner */}
          {user && user.id === artwork.user_id && (
            <button
              onClick={handleDelete}
              className="mt-4 w-full border border-red-300 text-red-500 hover:bg-red-50 font-medium py-2.5 rounded-xl transition"
            >
              Delete Artwork
            </button>
          )}
        </div>
      </div>
    </div>
  );
}