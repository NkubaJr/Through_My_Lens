import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = ['Photography', 'Painting', 'Digital Art', 'Illustration', 'Mixed Media'];
const COUNTRIES = ['Rwanda', 'Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Ethiopia', 'Tanzania', 'Uganda', 'Senegal', 'Other'];

export default function Upload() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', story: '', category: '', country: '', file_url: '' });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-earth-600 text-lg">
          Please <a href="/login" className="underline font-medium">log in</a> to upload artwork.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.story.length < 50) {
      toast.error('Your story must be at least 50 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/artworks', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Artwork uploaded successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-earth-800 mb-2">Share Your Work</h2>
      <p className="text-earth-500 text-sm mb-8">Tell the story behind your art</p>

      <div className="bg-white rounded-3xl shadow-lg p-8 space-y-5">

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Give your artwork a title"
            className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Image URL</label>
          <input
            type="text"
            name="file_url"
            value={form.file_url}
            onChange={handleChange}
            placeholder="Paste a link to your image"
            className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
          />
          <p className="text-xs text-earth-400 mt-1">
            Tip: upload your image to imgur.com and paste the link here
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
            >
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">
            Your Story <span className="text-earth-400 font-normal">(min. 50 characters)</span>
          </label>
          <textarea
            name="story"
            value={form.story}
            onChange={handleChange}
            rows={5}
            placeholder="What inspired this piece? What story does it tell?"
            className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400 resize-none"
          />
          <p className={`text-xs mt-1 ${form.story.length < 50 ? 'text-earth-400' : 'text-green-500'}`}>
            {form.story.length} / 50 characters minimum
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-earth-600 hover:bg-earth-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Publish Artwork'}
        </button>

      </div>
    </div>
  );
}