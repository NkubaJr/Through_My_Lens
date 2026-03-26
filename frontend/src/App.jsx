import Admin from './pages/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import ArtworkDetail from './pages/ArtworkDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5ebe0', position: 'relative', overflow: 'hidden' }}>

          {/* Decorative background shapes */}
          <div style={{
            position: 'fixed', inset: 0,
            zIndex: 0, pointerEvents: 'none',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-120px', left: '-120px',
              width: '400px', height: '400px', borderRadius: '50%',
              backgroundColor: '#e49a3a', opacity: 0.12
            }} />
            <div style={{
              position: 'absolute', top: '60px', right: '80px',
              width: '120px', height: '120px', borderRadius: '50%',
              backgroundColor: '#a85f18', opacity: 0.1
            }} />
            <div style={{
              position: 'absolute', top: '35%', left: '-80px',
              width: '280px', height: '280px',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              backgroundColor: '#7d4415', opacity: 0.08
            }} />
            <div style={{
              position: 'absolute', top: '40%', right: '-60px',
              width: '220px', height: '220px',
              borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%',
              backgroundColor: '#e49a3a', opacity: 0.1
            }} />
            <div style={{
              position: 'absolute', bottom: '-80px', left: '10%',
              width: '300px', height: '300px',
              borderRadius: '70% 30% 50% 50% / 40% 60% 40% 60%',
              backgroundColor: '#a85f18', opacity: 0.09
            }} />
            <div style={{
              position: 'absolute', bottom: '-60px', right: '-60px',
              width: '350px', height: '350px', borderRadius: '50%',
              backgroundColor: '#3b1f0e', opacity: 0.07
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px', height: '600px', borderRadius: '50%',
              backgroundColor: '#e49a3a', opacity: 0.04
            }} />
          </div>

          {/* All content sits above the shapes */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Navbar />
            <Toaster position="top-right" />
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;