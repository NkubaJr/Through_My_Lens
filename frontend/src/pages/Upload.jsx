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
  const [form, setForm] = useState({ title: '', story: '', category: '', country: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a85f18', fontSize: '1.1rem' }}>
          Please <a href="/login" style={{ textDecoration: 'underline', fontWeight: '600' }}>log in</a> to upload artwork.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }
    if (form.story.length < 50) {
      toast.error('Your story must be at least 50 characters');
      return;
    }
    setLoading(true);
    try {
      // upload image first
      const imageData = new FormData();
      imageData.append('image', imageFile);
      const uploadRes = await axios.post('http://localhost:5000/api/upload', imageData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // then submit artwork with the returned image URL
      await axios.post('http://localhost:5000/api/artworks', {
        ...form,
        file_url: uploadRes.data.url
      }, {
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
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 24px 60px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: '#e49a3a', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#3b1f0e" viewBox="0 0 24 24">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#3b1f0e', marginBottom: '8px' }}>
          Share Your Story
        </h2>
        <p style={{ color: '#a85f18', fontSize: '1rem' }}>Let the world see Africa through your lens</p>
      </div>

      {/* Form Card */}
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '36px', boxShadow: '0 4px 24px rgba(59,31,14,0.08)'
      }}>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '8px' }}>
            ✦ Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Give your work a compelling title"
            style={{
              width: '100%', padding: '12px 16px',
              border: '2px solid #e49a3a', borderRadius: '12px',
              fontSize: '0.95rem', color: '#3b1f0e',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '8px' }}>
            🖼 Image
          </label>
          <div
            onClick={() => document.getElementById('imageInput').click()}
            style={{
              border: '2px dashed #e49a3a', borderRadius: '12px',
              padding: '24px', textAlign: 'center',
              cursor: 'pointer', background: '#fdf8f0',
              overflow: 'hidden'
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={{ maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }} />
            ) : (
              <div>
                <p style={{ color: '#a85f18', fontWeight: '500' }}>Click to upload image</p>
                <p style={{ color: '#c9a06a', fontSize: '0.8rem', marginTop: '4px' }}>JPG, PNG up to 5MB</p>
              </div>
            )}
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Category and Country */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '8px', display: 'block' }}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #e49a3a', borderRadius: '12px',
                fontSize: '0.95rem', color: '#3b1f0e',
                outline: 'none', background: 'white', boxSizing: 'border-box'
              }}
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '8px', display: 'block' }}>
              Country
            </label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #e49a3a', borderRadius: '12px',
                fontSize: '0.95rem', color: '#3b1f0e',
                outline: 'none', background: 'white', boxSizing: 'border-box'
              }}
            >
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Story */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#3b1f0e', marginBottom: '8px', display: 'block' }}>
            Your Story <span style={{ color: '#a85f18', fontWeight: '400' }}>(min. 50 characters)</span>
          </label>
          <textarea
            name="story"
            value={form.story}
            onChange={handleChange}
            rows={5}
            placeholder="What inspired this piece? What story does it tell?"
            style={{
              width: '100%', padding: '12px 16px',
              border: '2px solid #e49a3a', borderRadius: '12px',
              fontSize: '0.95rem', color: '#3b1f0e',
              outline: 'none', resize: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit'
            }}
          />
          <p style={{ fontSize: '0.8rem', marginTop: '4px', color: form.story.length < 50 ? '#a85f18' : '#16a34a' }}>
            {form.story.length} / 50 characters minimum
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            backgroundColor: loading ? '#c9a06a' : '#3b1f0e',
            color: 'white', border: 'none',
            borderRadius: '12px', fontSize: '1rem',
            fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Publish Artwork'}
        </button>
      </div>
    </div>
  );
}