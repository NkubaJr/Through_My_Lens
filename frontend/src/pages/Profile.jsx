import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchMyArtworks();
  }, [user]);

  const fetchMyArtworks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/artworks');
      const mine = res.data.filter(a => a.user_id === user.id);
      setArtworks(mine);
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

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-earth-800">My Portfolio</h2>
          <p className="text-earth-500 text-sm mt-1">Welcome back, {user.username}</p>
        </div>
        <Link
          to="/upload"
          className="bg-earth-600 hover:bg-earth-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          + New Artwork
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-earth-400">Loading your portfolio...</div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-earth-400 text-lg">No artworks yet.</p>
          <Link to="/upload" className="text-earth-600 underline text-sm mt-2 block">Upload your first piece</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map(artwork => (
            <div key={artwork.artwork_id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Link to={`/artwork/${artwork.artwork_id}`}>
                <img
                  src={artwork.file_url}
                  alt={artwork.title}
                  className="w-full h-48 object-cover hover:opacity-90 transition"
                />
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-earth-800 truncate">{artwork.title}</h3>
                <p className="text-earth-500 text-xs mt-1">{artwork.category} · {artwork.country}</p>
                <button
                  onClick={() => handleDelete(artwork.artwork_id)}
                  className="mt-3 w-full border border-red-300 text-red-500 hover:bg-red-50 text-sm py-1.5 rounded-lg transition"
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