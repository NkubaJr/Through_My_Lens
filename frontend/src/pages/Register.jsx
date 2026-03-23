import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-earth-800 mb-2">Join My Lens</h2>
        <p className="text-earth-500 text-sm mb-6">Share your story with the world</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="yourname"
              className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-earth-600 hover:bg-earth-500 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-sm text-earth-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-earth-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}