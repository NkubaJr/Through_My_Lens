import { useState, useEffect } from 'react';
import axios from 'axios';
import ArtworkCard from '../components/ArtworkCard';

const CATEGORIES = ['All', 'Photography', 'Painting', 'Digital Art', 'Illustration', 'Mixed Media'];
const COUNTRIES = ['All', 'Rwanda', 'Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Ethiopia', 'Tanzania', 'Uganda', 'Senegal', 'Other'];

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [country, setCountry] = useState('All');

  useEffect(() => {
    fetchArtworks();
  }, [category, country]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (country !== 'All') params.country = country;
      const res = await axios.get('http://localhost:5000/api/artworks', { params });
      setArtworks(res.data);
    } catch (err) {
      console.error('Failed to fetch artworks', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-earth-800 mb-3">
          Africa Through Our Lens 🌍
        </h1>
        <p className="text-earth-500 max-w-xl mx-auto text-sm">
          A gallery of authentic African stories told through art. Every piece has a voice — take a moment to listen.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div>
          <label className="text-xs font-medium text-earth-600 mr-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-earth-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400 bg-white"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-earth-600 mr-2">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-earth-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400 bg-white"
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-earth-400">Loading gallery...</div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-earth-400 text-lg">No artworks yet.</p>
          <p className="text-earth-300 text-sm mt-1">Be the first to share your story!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map(artwork => (
            <ArtworkCard key={artwork.artwork_id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}