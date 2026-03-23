import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-earth-800 mb-2">Welcome Back</h2>
        <p className="text-earth-500 text-sm mb-6">Log in to your My Lens account</p>

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
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        <p className="text-center text-sm text-earth-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-earth-600 font-medium hover:underline">Join Us</Link>
        </p>
      </div>
    </div>
  );
}