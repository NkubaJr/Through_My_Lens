import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-earth-800 text-earth-50 px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide text-earth-200">
        My Lens 📸
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-earth-300 transition">Gallery</Link>

        {user ? (
          <>
            <Link to="/upload" className="hover:text-earth-300 transition">Upload</Link>
            <Link to="/profile" className="hover:text-earth-300 transition">My Portfolio</Link>
            <span className="text-earth-400">|</span>
            <span className="text-earth-300">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-earth-600 hover:bg-earth-500 px-4 py-1.5 rounded-full transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-earth-300 transition">Login</Link>
            <Link
              to="/register"
              className="bg-earth-500 hover:bg-earth-400 px-4 py-1.5 rounded-full transition"
            >
              Join Us
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}