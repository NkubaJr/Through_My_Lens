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
        <div className="min-h-screen bg-earth-50">
          <Navbar />
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;