import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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
    <>
      {/* Top logo */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', paddingBottom: '8px' }}>
        <Link
          to="/"
          style={{
            backgroundColor: '#3b1f0e', color: 'white',
            padding: '10px 32px', borderRadius: '999px',
            fontWeight: '700', fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(59,31,14,0.3)'
          }}
        >
          My Lens
        </Link>
      </div>

      {/* Floating sidebar — desktop */}
      <div
        className="desktop-sidebar"
        style={{
          position: 'fixed', right: '16px', top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#3b1f0e',
          borderRadius: '999px', padding: '12px 10px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '20px',
          zIndex: 1000, boxShadow: '0 4px 20px rgba(59,31,14,0.4)'
        }}
      >
        <Link to="/" title="Gallery" style={{ color: 'white', display: 'flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </Link>
        <Link to="/upload" title="Upload" style={{ color: 'white', display: 'flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
        </Link>
        <Link to={user ? "/profile" : "/login"} title="Profile" style={{ color: 'white', display: 'flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </Link>
        {user && (
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              color: 'white', background: 'none',
              border: 'none', cursor: 'pointer', display: 'flex'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.4 1.4 2.6 2.6H9v2h9.2l-2.6 2.6L17 17l5-5-5-5zM5 5h7V3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h7v-2H5V5z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Bottom nav bar — mobile */}
      <div
        className="mobile-nav"
        style={{
          display: 'none',
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: '#3b1f0e',
          padding: '12px 0', zIndex: 1000,
          boxShadow: '0 -4px 20px rgba(59,31,14,0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', fontSize: '0.65rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Gallery
          </Link>
          <Link to="/upload" style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', fontSize: '0.65rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            Upload
          </Link>
          <Link to={user ? "/profile" : "/login"} style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', fontSize: '0.65rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            Profile
          </Link>
          {user && (
            <button
              onClick={handleLogout}
              style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.4 1.4 2.6 2.6H9v2h9.2l-2.6 2.6L17 17l5-5-5-5zM5 5h7V3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h7v-2H5V5z"/>
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}